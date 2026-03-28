import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event)=>{
    event.preventDefault();

    if(currState === 'Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }

    login(currState=== "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})
  }

  return (
    <div className='min-h-screen bg-[#0f172a] flex items-center justify-center gap-12 sm:justify-center max-sm:flex-col p-8'>

      {/* -------- left -------- */}
      <div className='text-center max-sm:mb-8'>
        <div className='w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl'>
          <span className='text-6xl'>🤖</span>
        </div>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4'>QuickChat AI</h1>
        <p className='text-white/70 text-lg'>Your intelligent conversation partner</p>
      </div>

      {/* -------- right -------- */}
      <form onSubmit={onSubmitHandler} className='bg-white/5 backdrop-blur-xl border border-white/10 p-8 flex flex-col gap-6 rounded-3xl shadow-2xl w-full max-w-md'>
        <h2 className='font-bold text-3xl text-white text-center mb-2'>
          {currState}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-6 cursor-pointer float-right mt-1'/>
          }
        </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input onChange={(e)=>setFullName(e.target.value)} value={fullName}
           type="text" className='p-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-400 text-white placeholder-white/50 transition-all duration-300' placeholder="Full Name" required/>
        )}

        {!isDataSubmitted && (
          <>
          <input onChange={(e)=>setEmail(e.target.value)} value={email}
           type="email" placeholder='Email Address' required className='p-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-400 text-white placeholder-white/50 transition-all duration-300'/>
          <input onChange={(e)=>setPassword(e.target.value)} value={password}
           type="password" placeholder='Password' required className='p-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-400 text-white placeholder-white/50 transition-all duration-300'/>
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
             rows={4} className='p-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-400 text-white placeholder-white/50 transition-all duration-300 resize-none' placeholder='Tell us about yourself...' required></textarea>
          )
        }

        <button type='submit' className='py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl cursor-pointer font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 neon-glow'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-3 text-sm text-white/70'>
          <input type="checkbox" className='accent-purple-500'/>
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='text-center'>
          {currState === "Sign up" ? (
            <p className='text-sm text-white/70'>Already have an account? <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className='font-semibold text-purple-300 cursor-pointer hover:text-purple-200 transition-colors'>Login here</span></p>
          ) : (
            <p className='text-sm text-white/70'>Create an account <span onClick={()=> setCurrState("Sign up")} className='font-semibold text-purple-300 cursor-pointer hover:text-purple-200 transition-colors'>Click here</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
