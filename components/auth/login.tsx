import React, { useState } from 'react'
import {Input} from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '@radix-ui/react-label'
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('')
  const [checkEmail, setCheckEmail] = useState(false)

  const [password, setPassword] = useState('')
  const [checkPassword, setCheckPassword] = useState(false)

  const router = useRouter()

  //  HANDLE INPUT CHANGE  //
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmail(e.target.value)

    if(!regex.test(email)){
      setCheckEmail(false)
    }else{
      if(email == "" || email == undefined || email == null){
        setCheckEmail(false)
      }else{
        setCheckEmail(true)
      }
    }
  }
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/gm
    setPassword(e.target.value)
    if(password == "" || password == undefined || password == null){
      setCheckPassword(false)
    }else if(!regex.test(password)){
      setCheckPassword(false)
    }else{
      setCheckPassword(true)
    }
  }


  return (
    <>
        <div className='m-1 w-full'>
            <Label htmlFor='email' className={`text-sm ${checkEmail === false ? 'text-slate-50' : 'text-green-600'}`}>email <span className='text-red-600 text-xs font-black'>*</span></Label>
            <Input
              value={email}
              onChange={handleChangeEmail}
              id="email" 
              type="email" 
              placeholder='ex. mail@gmail.com'
              className={`${checkEmail === false ? 'border-slate-50' : 'border-green-600'}`}>
            </Input>
            
            <Label htmlFor='password' className={`text-sm ${checkPassword === false ? 'text-slate-50' : 'text-green-600'}`}>password <span className='text-red-600 text-xs font-black'>*</span></Label>
            <Input 
              value={password}
              onChange={handleChangePassword}
              id="password" 
              type="password" 
              placeholder='password'
              className={`${checkPassword === false ? 'border-slate-50' : 'border-green-600'}`}></Input>

            <div className='flex flex-row justify-center items-center mt-2'>
                <Button className='bg-slate-50 text-slate-950 mt-2 font-black'>
                    <FcGoogle className='m-1' />
                    Login with Google
                </Button>
                <span className='m-2 my-3'>or</span>
                <Button className='bg-slate-50 text-slate-950 mt-2 font-black'>Login</Button>
            </div>
        </div>
    </>
  )
}

export default Login