import React from 'react'
import {Input} from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '@radix-ui/react-label'
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <>
        <div className='m-1 w-full'>
            <Label htmlFor='email' className='text-sm'>email <span className='text-red-600 text-xs font-black'>*</span></Label>
            <Input id="email" type="email" placeholder='ex. mail@gmail.com'></Input>
            
            <Label htmlFor='password' className='text-sm'>password <span className='text-red-600 text-xs font-black'>*</span></Label>
            <Input id="password" type="password" placeholder='password'></Input>

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