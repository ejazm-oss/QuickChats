import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

    const {selectedUser} = useContext(ChatContext)

  return (
    <div className='w-full h-screen p-4 md:p-8'>
      <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden h-full grid grid-cols-1 relative shadow-2xl ${selectedUser ? 'md:grid-cols-[320px_1fr_280px] lg:grid-cols-[350px_1fr_300px]' : 'md:grid-cols-[350px_1fr]'}`}>
        <Sidebar />
        <ChatContainer />
        <RightSidebar/>
      </div>
    </div>
  )
}

export default HomePage
