import React from 'react'
import Link from 'next/link'

const ErrorContent = ({backUrl}:{backUrl:string}) => {
  return (
    <>
        <div className='flex flex-col justify-center items-center text-center mt-40 space-y-4 border border-slate-50 rounded-lg m-5 p-5'>
            <span className='text-2xl'>Something went wrong!</span>
            <div className='flex flex-row justify-center items-center space-x-2'>
                <div className='border-r border-slate-50 p-2'>
                    <span className='text-4xl'>500</span>
                </div>
                <div className='m-2'>
                    <span>There was an error processing your request</span>
                </div>
            </div>
            <Link href={backUrl}><span className='underline font-black'>Go Back to Home</span></Link>
        </div>
    </>
  )
}

export default ErrorContent