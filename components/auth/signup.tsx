'use client'
import React from 'react'
import { Button } from '../ui/button'
import {Input} from '../ui/input'
import GoogleButton from 'react-google-button';
import Link from 'next/link';

const SignUp = () => {
  return (
    <>
        <div className='flex flex-col justify-center items-center space-y-2'>
            <span className='text-2xl tracking-widest'>SIGNUP</span>
            <GoogleButton></GoogleButton>
            <Input type="email" placeholder="email (ex. email@gmail.com)" />
            <Input type="password" placeholder="password" />
            <Input type="password" placeholder="confirm password" />
            <div className='grid grid-cols-2 gap-2 m-2'>
                <Link href="/login">
                    <span className='underline text-slate-50'>Login</span>
                </Link>
                
                <Button className='bg-slate-50 text-slate-950 font-black'>Next</Button>
            </div>
        </div>
    </>
  )
}

export default SignUp