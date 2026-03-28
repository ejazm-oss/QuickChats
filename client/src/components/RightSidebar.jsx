import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {

    const {selectedUser, messages} = useContext(ChatContext)
    const {logout, onlineUsers} = useContext(AuthContext)
    const [msgImages, setMsgImages] = useState([])

    // Get all the images from the messages and set them to state
    useEffect(()=>{
        setMsgImages(
            messages.filter(msg => msg.image).map(msg=>msg.image)
        )
    },[messages])

  return selectedUser && (
    <div className={`bg-white/5 backdrop-blur-lg border-l border-white/10 text-white w-full relative overflow-y-scroll rounded-r-3xl ${selectedUser ? "max-md:hidden" : ""}`}>

        <div className='pt-8 pb-6 flex flex-col items-center gap-4 text-center px-6'>
            <div className='relative'>
              <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
              className='w-24 h-24 rounded-full border-4 border-gradient-to-r from-purple-400 to-blue-400 shadow-lg' />
              {onlineUsers.includes(selectedUser._id) && <div className='absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-[#0f172a]'></div>}
            </div>
            <div>
              <h1 className='text-2xl font-bold text-white mb-1'>{selectedUser.fullName}</h1>
              <p className='text-sm text-white/70'>{selectedUser.bio || 'AI Assistant ready to help!'}</p>
            </div>
        </div>

        <hr className="border-white/20 my-6 mx-6"/>

        <div className="px-6">
            <h3 className='text-lg font-semibold mb-4 text-white'>Shared Media</h3>
            <div className='max-h-48 overflow-y-scroll grid grid-cols-3 gap-3'>
                {msgImages.map((url, index)=>(
                    <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg'>
                        <img src={url} alt="" className='w-full h-20 object-cover'/>
                    </div>
                ))}
            </div>
        </div>

        <div className='absolute bottom-6 left-6 right-6'>
            <button onClick={()=> logout()} className='w-full bg-gradient-to-r from-red-500 to-pink-500 text-white border-none text-sm font-medium py-3 px-6 rounded-2xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300'>
                Logout
            </button>
        </div>
    </div>
  )
}

export default RightSidebar
