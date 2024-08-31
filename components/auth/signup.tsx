'use client'
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import supabase from '@/lib/supabase/supabaseClient';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const router = useRouter()

  const [error, setError] = useState('')
  const [isError, setIsError] = useState(false)

  const [email, setEmail] = useState('');
  const [checkEmail, setCheckEmail] = useState(false);

  const [name, setName] = useState('')
  const [checkName, setCheckName] = useState(false)
  const [surname, setSurname] = useState('')
  const [checkSurname, setCheckSurname] = useState(false)

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState(false);
  const [checkConfirmPassword, setCheckConfirmPassword] = useState(false);


  // Handle Email Change
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setCheckEmail(regex.test(value) && value !== '');
  };

  // Handle Name Change
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value
    setName(value)

    if(value !== ''){
      setCheckName(true)
    }else{
      setCheckName(false)
    }
  }

  // Handle Surname Change
  const handleChangeSurname = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value
    setSurname(value)

    if(value !== ''){
      setCheckSurname(true)
    }else{
      setCheckSurname(false)
    }
  }

  // Handle Password Change
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
    setCheckPassword(regex.test(value));
    // Update confirmPassword check based on new password
    if (confirmPassword === '') {
      setCheckConfirmPassword(false); // Confirm password is invalid if empty
    } else {
      setCheckConfirmPassword(value === confirmPassword);
    }
  };

  // Handle Confirm Password Change
  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    // Confirm password is invalid if it doesn't match the password or if it's empty
    setCheckConfirmPassword(value === password && value !== '');
  };

  const handleSignupVerification = async()=>{
    const {data, error} = await supabase.from("profiles").select("*").eq("email", email).single()
    if(data === null){
      setError("")
      setIsError(false)
      const{data, error} = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if(error){
        setError("error during signin conncetion")
        console.log(error)
        setIsError(true)
      }else{
        const {data, error} = await supabase.from("profiles").insert([{
          name:name, 
          surname:surname, 
          email:email, 
          role:"member", 
          orders:0
        }])
        if(error){
          setError("error during signin conncetion")
          console.log(error)
          setIsError(true)
        }else{
          toast.success("You have created an account successfully\nCheck the email inbox to verify account")
          router.push(`/auth/verify-email?email=${email}`)
        }
      }
    }else{
      setError("this account already exits, change email")
      setIsError(true)
    }
  }

  const handleSignup = ()=>{
    if(checkEmail && checkName && checkSurname && checkPassword && checkConfirmPassword){
      
      handleSignupVerification()

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
  /////////////////  RETURN  /////////////////
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

        <div className='flex flex-col justify-center items-center text-center'>
          <Label htmlFor='email' className={`text-sm ${checkEmail ? 'text-green-600' : 'text-slate-50'}`}>
            Email <span className='text-red-600 text-xs font-black'>*</span>
          </Label>
          <Input
            id='email'
            onChange={handleChangeEmail}
            value={email}
            type='email'
            placeholder='ex. mail@gmail.com'
            className={`border ${checkEmail ? 'border-green-600' : 'border-slate-50'}`}
          />

          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label htmlFor='name' className={`text-sm ${checkName ? 'text-green-600' : 'text-slate-50'}`}>name <span className='text-red-600 text-sm font-black'>*</span></Label>
              <Input
                id='name'
                type="text"
                placeholder='Name'
                onChange={handleChangeName}
                value={name}
                className={`border ${checkName ? 'border-green-600' : 'border-slate-50'}`}>
              </Input>
            </div>
            <div>
              <Label htmlFor='surname' className={`text-sm ${checkSurname ? 'text-green-600' : 'text-slate-50'}`}>surname <span className='text-red-600 text-sm font-black'>*</span></Label>
              <Input
                id='surname'
                type="text"
                placeholder='Surname'
                onChange={handleChangeSurname}
                value={surname}
                className={`border ${checkSurname ? 'border-green-600' : 'border-slate-50'}`}>
              </Input>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label htmlFor='password' className={`text-sm ${checkPassword ? 'text-green-600' : 'text-slate-50'}`}>
                Password <span className='text-red-600 text-xs font-black'>*</span>
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='Password'
                onChange={handleChangePassword}
                value={password}
                className={`border ${checkPassword ? 'border-green-600' : 'border-slate-50'}`}
              />
            </div>
            <div>
              <Label htmlFor='confirmPassword' className={`text-sm ${checkConfirmPassword ? 'text-green-600' : 'text-slate-50'}`}>
                Confirm Password <span className='text-red-600 text-xs font-black'>*</span>
              </Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Confirm Password'
                onChange={handleChangeConfirmPassword}
                value={confirmPassword}
                className={`border ${checkConfirmPassword ? 'border-green-600' : 'border-slate-50'}`}
              />
            </div>
          </div>
          <div className={`mt-1 ${checkPassword ? 'hidden' : 'block'}`}>
            <span className='text-sm text-red-600 font-black'>(8-16, abc, ABC, 123, !$#)</span>
          </div>
        </div>

        <div className='flex flex-row justify-center items-center mt-2'>
          <Button onClick={handleGoogleLogin} className='bg-slate-50 text-slate-950 mt-2 font-black'>
            <FcGoogle className='m-1' />
            Signup with Google
          </Button>
          <span className='m-2 my-3'>or</span>
          <Button onClick={handleSignup} className='bg-slate-50 text-slate-950 mt-2 font-black'>Signup</Button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;
