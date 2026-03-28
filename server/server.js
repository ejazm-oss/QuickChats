import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import Message from "./models/Message.js";
import cloudinary from "./lib/cloudinary.js";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app)

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId){
        userSocketMap[userId] = socket.id;
        socket.join(userId); // Join user to their own room
    }
    
    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle sendMessage event
    socket.on("sendMessage", async (data) => {
        try {
            const { text, image, receiverId } = data;
            const senderId = userId; // from handshake

            let imageUrl;
            if(image){
                const uploadResponse = await cloudinary.uploader.upload(image)
                imageUrl = uploadResponse.secure_url;
            }
            const newMessage = await Message.create({
                senderId,
                receiverId,
                text,
                image: imageUrl
            })

            // Emit to receiver
            io.to(receiverId).emit("receiveMessage", newMessage)

            // Emit back to sender
            socket.emit("messageSent", newMessage)

        } catch (error) {
            console.log("Error sending message:", error.message);
            socket.emit("messageError", { message: error.message });
        }
    });

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

// Middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors());


// Routes setup
app.use("/api/status", (req, res)=> res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)


// Connect to MongoDB
await connectDB();

if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5002;
    server.listen(PORT, ()=> console.log("Server is running on PORT: " + PORT));
}

// Export server for Vervel
export default server;
