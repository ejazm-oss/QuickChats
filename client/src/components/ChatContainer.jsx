import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {

    const { messages, selectedUser, setSelectedUser, sendMessage, 
        getMessages} = useContext(ChatContext)

    const { authUser, onlineUsers } = useContext(AuthContext)

    const scrollEnd = useRef()
    const inputRef = useRef()

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Handle sending a message
    const handleSendMessage = async (e)=>{
        e.preventDefault();
        if(input.trim() === "" || isSending) return null;
        setIsSending(true);
        await sendMessage({text: input.trim()});
        setInput("");
        setIsSending(false);
        inputRef.current?.focus();
    }

    // Handle sending an image
    const handleSendImage = async (e) =>{
        const file = e.target.files[0];
        if(!file || !file.type.startsWith("image/")){
            toast.error("Please select a valid image file")
            return;
        }
        setIsSending(true);
        const reader = new FileReader();

        reader.onloadend = async ()=>{
            try {
                await sendMessage({image: reader.result})
                e.target.value = ""
            } catch (error) {
                toast.error(error.message || "Failed to send image")
            } finally {
                setIsSending(false);
            }
        }
        reader.onerror = () => {
            toast.error("Failed to read image file")
            setIsSending(false);
            e.target.value = ""
        }
        reader.readAsDataURL(file)
    }

    useEffect(()=>{
        if(selectedUser){
            getMessages(selectedUser._id)
        }
    },[selectedUser])

    useEffect(()=>{
        if(scrollEnd.current && messages){
            setTimeout(() => {
                scrollEnd.current?.scrollIntoView({ behavior: "smooth"})
            }, 100);
        }
    },[messages])

  return selectedUser ? (
    <div className='h-full flex flex-col relative bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 overflow-hidden'>
      {/* Background blur effect */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none'></div>
      
      {/* Header */}
      <div className='relative z-10 flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-14 h-14 rounded-full border-2 border-purple-400/50 shadow-lg"/>
            {onlineUsers.includes(selectedUser._id) && (
              <div className='absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-950 shadow-lg'></div>
            )}
          </div>
          <div>
            <p className='text-lg font-semibold text-white'>{selectedUser.fullName}</p>
            <p className={`text-xs font-medium ${onlineUsers.includes(selectedUser._id) ? 'text-green-400' : 'text-gray-400'}`}>
              {onlineUsers.includes(selectedUser._id) ? '● Online' : '● Offline'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <button className='p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-110'>
            <span className='text-lg'>📞</span>
          </button>
          <button className='p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-110'>
            <span className='text-lg'>📹</span>
          </button>
          <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden w-6 cursor-pointer hover:scale-110 transition-transform duration-300'/>
        </div>
      </div>

      {/* Chat Area with custom scrollbar */}
      <div className='relative z-10 flex-1 overflow-y-auto px-6 py-6 space-y-4 scroll-smooth custom-scrollbar flex flex-col'>
        {/* Messages */}
        {messages.length === 0 ? (
          <div className='h-full flex flex-col items-center justify-center text-center gap-4'>
            <div className='w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10'>
              <span className='text-4xl'>💬</span>
            </div>
            <p className='text-white/50 text-sm max-w-xs'>No messages yet. Start the conversation with {selectedUser.fullName}!</p>
          </div>
        ) : (
          messages.map((msg, index)=>(
            msg.senderId === authUser._id ? (
              // Outgoing Message - Right side
              <div key={index} className='flex items-end gap-3 animate-message-in justify-end'>
                <div className='relative'>
                  <img 
                    src={authUser?.profilePic || assets.avatar_icon} 
                    alt="you" 
                    className='w-9 h-9 rounded-full border-2 border-purple-400/50 flex-shrink-0 shadow-lg order-2'
                  />
                </div>
                
                <div className='flex flex-col gap-2 items-end max-w-xs lg:max-w-md order-1'>
                  {msg.image ? (
                    <div className='relative group'>
                      <img 
                        src={msg.image} 
                        alt="sent message" 
                        className='rounded-[20px] rounded-tr-none border-2 border-purple-400/30 shadow-xl hover:shadow-2xl transition-all duration-300 max-h-80 object-cover hover:scale-105'
                      />
                      <div className='absolute bottom-3 right-3 text-white text-xs bg-black/50 backdrop-blur-md px-3 py-1 rounded-full font-medium'>
                        {formatMessageTime(msg.createdAt)}
                      </div>
                      {msg.seen && <div className='absolute -bottom-6 right-0 text-blue-400 text-xs font-semibold'>✓✓ Seen</div>}
                    </div>
                  ) : (
                    <div className='bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 text-white px-5 py-3 rounded-[20px] rounded-tr-none shadow-lg hover:shadow-2xl transition-all duration-300 group hover:scale-105 border border-purple-400/30 relative overflow-hidden'>
                      <div className='absolute inset-0 bg-white/5 rounded-[20px]'></div>
                      <p className='text-sm leading-relaxed break-words relative z-10'>{msg.text}</p>
                    </div>
                  )}
                  <div className='flex items-center gap-2 text-xs text-gray-400 pr-2'>
                    <span>{formatMessageTime(msg.createdAt)}</span>
                    <span className='text-blue-400 font-bold'>
                      {msg.seen ? '✓✓' : '✓'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Incoming Message - Left side
              <div key={index} className='flex items-end gap-3 animate-message-in justify-start'>
                <div className='relative'>
                  <img 
                    src={selectedUser?.profilePic || assets.avatar_icon} 
                    alt={selectedUser?.fullName} 
                    className='w-9 h-9 rounded-full border-2 border-cyan-400/50 flex-shrink-0 shadow-lg order-1'
                  />
                  {onlineUsers.includes(selectedUser._id) && (
                    <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-950 shadow-lg'></div>
                  )}
                </div>
                
                <div className='flex flex-col gap-2 items-start max-w-xs lg:max-w-md order-2'>
                  <div className='text-xs text-gray-400 px-3 font-medium'>{selectedUser?.fullName}</div>
                  {msg.image ? (
                    <div className='relative group'>
                      <img 
                        src={msg.image} 
                        alt="received message" 
                        className='rounded-[20px] rounded-tl-none border-2 border-cyan-400/30 shadow-xl hover:shadow-2xl transition-all duration-300 max-h-80 object-cover hover:scale-105'
                      />
                      <div className='absolute bottom-3 right-3 text-white text-xs bg-black/50 backdrop-blur-md px-3 py-1 rounded-full font-medium'>
                        {formatMessageTime(msg.createdAt)}
                      </div>
                    </div>
                  ) : (
                    <div className='bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 text-white px-5 py-3 rounded-[20px] rounded-tl-none shadow-lg hover:shadow-2xl transition-all duration-300 group hover:scale-105 border border-cyan-400/20 relative overflow-hidden backdrop-blur-sm'>
                      <div className='absolute inset-0 bg-white/5 rounded-[20px]'></div>
                      <p className='text-sm leading-relaxed break-words relative z-10'>{msg.text}</p>
                    </div>
                  )}
                  <div className='text-xs text-gray-400 px-3'>
                    {formatMessageTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            )
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className='flex items-end gap-3 animate-message-in'>
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full border border-white/20 flex-shrink-0'/>
            <div className='flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-[18px] rounded-bl-none shadow-lg'>
              <div className='flex gap-1'>
                <div className='w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full typing-dot'></div>
                <div className='w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full typing-dot'></div>
                <div className='w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full typing-dot'></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={scrollEnd}></div>
      </div>

      {/* Input Area */}
      <div className='relative z-10 px-6 py-4 bg-white/5 backdrop-blur-xl border-t border-white/10 shadow-lg'>
        <form onSubmit={handleSendMessage} className='space-y-3'>
          <div className='flex items-end gap-3'>
            {/* Input Field */}
            <div className='flex-1 flex items-end gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-[20px] border border-white/20 focus-within:border-purple-400/50 focus-within:bg-white/15 transition-all duration-300 group'>
              <input 
                ref={inputRef}
                onChange={(e)=> setInput(e.target.value)} 
                value={input} 
                onKeyDown={(e)=> {
                  if(e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }} 
                type="text" 
                placeholder="Type your message..." 
                disabled={isSending}
                className='flex-1 text-sm bg-transparent border-none outline-none text-white placeholder-white/50 disabled:opacity-50'
              />
              
              {/* Action Buttons */}
              <div className='flex items-center gap-1'>
                {/* Emoji Picker */}
                <button 
                  type='button'
                  className='p-2 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 text-lg'
                >
                  😊
                </button>
                
                {/* Image Upload */}
                <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden disabled={isSending}/>
                <label htmlFor="image" className={`p-2 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 text-lg cursor-pointer ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  📎
                </label>
                
                {/* Voice Message */}
                <button 
                  type='button'
                  className='p-2 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 text-lg'
                >
                  🎤
                </button>
              </div>
            </div>

            {/* Send Button */}
            <button 
              onClick={handleSendMessage}
              disabled={!input.trim() || isSending}
              type='submit'
              className={`p-3 rounded-[16px] transition-all duration-300 flex items-center justify-center flex-shrink-0 font-semibold text-white ${
                input.trim() && !isSending
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-110 cursor-pointer active:scale-95 glow-button'
                  : 'bg-white/10 opacity-50 cursor-not-allowed border border-white/10'
              }`}
            >
              {isSending ? (
                <span className='text-lg animate-spin'>⟳</span>
              ) : (
                <span className='text-xl'>➤</span>
              )}
            </button>
          </div>

          {/* Quick Suggestions */}
          {input.trim() === "" && (
            <div className='flex gap-2 overflow-x-auto pb-1 scroll-smooth'>
              {['Hello! 👋', 'How are you?', 'Thanks! 😊'].map((suggestion, idx) => (
                <button 
                  key={idx}
                  type='button'
                  onClick={() => {
                    setInput(suggestion)
                    inputRef.current?.focus()
                  }}
                  className='px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-xs text-white/70 hover:text-white transition-all duration-300 whitespace-nowrap flex-shrink-0'
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-6 text-white/70 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 max-md:hidden h-full relative overflow-hidden'>
      {/* Background effects */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none'></div>
      
      <div className='relative z-10 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg'>
        <span className='text-5xl'>💬</span>
      </div>
      <div className='relative z-10 text-center max-w-md'>
        <p className='text-2xl font-bold text-white mb-2'>Welcome to QuickChat</p>
        <p className='text-sm text-white/60'>Select a contact to start chatting or create a new conversation</p>
      </div>
    </div>
  )
}

export default ChatContainer
