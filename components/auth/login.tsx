import React, { useState } from 'react'
import {Input} from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '@radix-ui/react-label'
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/supabaseClient';
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const Login = () => {
  const [error, setError] = useState('')
  const [isError, setIsError] = useState(false)

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

  const handleLogin = async()=>{
    if(checkEmail &&checkPassword){
      const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if(error){
        setError("error during login conncetion")
        setIsError(true)
      }else{
        setError("")
        setIsError(false)
        router.push("/private")
      }
    }else{
      setError("fill in all fields correctly")
      setIsError(true)
    }
  }

  const handleGoogleLogin = async()=>{
    const {data, error} = await supabase.auth.signInWithOAuth({
      provider: "google",
    })

    

    if(error){
      setError("error during login conncetion")
      setIsError(true)
    }else{
      setError("")
      setIsError(false)
      router.push("/private")
    }
  }

  return (
    <>
        <div className='m-1 w-full'>
            <Alert variant="destructive" className={`${isError ? 'block' : 'hidden'}`}>
              <ExclamationTriangleIcon />
              <AlertTitle>Error: </AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
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
                <Button onClick={handleGoogleLogin} className='bg-slate-50 text-slate-950 mt-2 font-black'>
                    <FcGoogle className='m-1' />
                    Login with Google
                </Button>
                <span className='m-2 my-3'>or</span>
                <Button onClick={handleLogin} className='bg-slate-50 text-slate-950 mt-2 font-black'>Login</Button>
            </div>
        </div>
    </>
  )
}

export default Login