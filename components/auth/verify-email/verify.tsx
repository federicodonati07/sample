import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Verify = ({email}:{email: string}) => {
  return (
    <>
    <div className='flex flex-col justify-center items-center text-center mt-40 space-y-4 border border-slate-50 rounded-lg m-5 p-5'>
        <span className='text-xl'>Verify Your Email</span>
        <span className='text-sm'>A verification link has been sent to <span className='font-black'>{email}</span>
        </span>
        <div className='flex flex-col justify-center items-center space-y-2'>
            <span>Have already verified your email?</span>
            <Link href='/auth'>
                <Button className='bg-white text-slate-950'>Login</Button>
            </Link>
            
        </div>
    </div>
        
    </>
  )
}

export default Verify