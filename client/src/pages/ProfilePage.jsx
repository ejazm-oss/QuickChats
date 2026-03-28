import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio});
      navigate('/');
    }
    
  }

  return (
    <div className='min-h-screen bg-[#0f172a] flex items-center justify-center p-8'>
      <div className='w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex items-center justify-between max-sm:flex-col-reverse p-8'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 text-white">
          <h3 className="text-2xl font-bold mb-4">Edit Profile</h3>
          <label htmlFor="avatar" className='flex items-center gap-4 cursor-pointer p-4 bg-white/10 rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-16 h-16 rounded-full border-2 border-purple-400/50`}/>
            <span className='text-white/70'>Upload profile image</span>
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name}
           type="text" required placeholder='Your name' className='p-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-400 text-white placeholder-white/50 transition-all duration-300'/>
           <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder="Write profile bio" required className="p-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-400 text-white placeholder-white/50 transition-all duration-300 resize-none" rows={4}></textarea>

           <button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-2xl text-lg font-semibold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 neon-glow">Save Changes</button>
        </form>
        <div className='flex-1 flex justify-center max-sm:mb-8'>
          <img className={`w-48 h-48 rounded-full border-4 border-gradient-to-r from-purple-400 to-blue-400 shadow-2xl`} src={authUser?.profilePic || assets.logo_icon} alt="" />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
