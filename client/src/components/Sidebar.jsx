import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {

    const {getUsers, users, selectedUser, setSelectedUser,
        unseenMessages, setUnseenMessages } = useContext(ChatContext);

    const {logout, onlineUsers} = useContext(AuthContext)

    const [input, setInput] = useState(false)

    const navigate = useNavigate();

    const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(()=>{
        getUsers();
    },[onlineUsers])

  return (
    <div className={`bg-white/5 backdrop-blur-lg border-r border-white/10 h-full p-6 rounded-l-3xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      {/* Header */}
      <div className='pb-6'>
        <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>QuickChat AI</h1>
            <div className="relative py-2 group">
                <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300'>
                  <span className='text-lg'>⚙️</span>
                </div>
                <div className='absolute top-full right-0 z-20 w-40 p-4 rounded-xl bg-black/80 backdrop-blur-lg border border-white/20 text-white hidden group-hover:block shadow-xl'>
                    <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm mb-2 hover:text-purple-300 transition-colors'>Edit Profile</p>
                    <hr className="my-2 border-t border-white/20" />
                    <p onClick={()=> logout()} className='cursor-pointer text-sm hover:text-red-300 transition-colors'>Logout</p>
                </div>
            </div>
        </div>

        {/* Search Bar */}
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl flex items-center gap-3 py-3 px-4 border border-white/20 hover:border-purple-400/50 transition-all duration-300'>
            <span className='text-purple-300'>🔍</span>
            <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-sm placeholder-white/50 flex-1' placeholder='Search conversations...'/>
        </div>
      </div>

      {/* User List */}
      <div className='flex flex-col gap-2'>
        {filteredUsers.map((user, index)=>(
            <div onClick={()=> {setSelectedUser(user); setUnseenMessages(prev=> ({...prev, [user._id]:0}))}}
             key={index} className={`relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/10 hover:shadow-lg group ${selectedUser?._id === user._id && 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 shadow-lg glow'}`}>
                <div className='relative'>
                  <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-12 h-12 rounded-full border-2 border-white/20'/>
                  {onlineUsers.includes(user._id) && <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0f172a]'></div>}
                </div>
                <div className='flex flex-col flex-1'>
                    <p className='font-medium text-white group-hover:text-purple-200 transition-colors'>{user.fullName}</p>
                    <p className={`text-xs ${onlineUsers.includes(user._id) ? 'text-green-400' : 'text-gray-400'}`}>
                      {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                    </p>
                </div>
                {unseenMessages[user._id] > 0 && <div className='bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs h-5 w-5 flex justify-center items-center rounded-full font-bold'>{unseenMessages[user._id]}</div>}
            </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
