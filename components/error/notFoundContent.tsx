import React from 'react'
import Link from 'next/link'

const NotFoundContent = ({backUrl}:{backUrl:string}) => {
  return (
    <>
        <div className='flex flex-col justify-center items-center text-center mt-40 space-y-4 border border-slate-50 rounded-lg m-5 p-5'>
            <span className='text-2xl'>Something went wrong!</span>
            <div className='flex flex-row justify-center items-center space-x-2'>
                <div className='border-r border-slate-50 p-2'>
                    <span className='text-4xl'>404</span>
                </div>
                <div className='m-2'>
                    <span>We could not find the page you were looking for</span>
                </div>
            </div>
            <Link href={backUrl}><span className='underline font-black'>Go Back to Home</span></Link>
        </div>
    </>
  )
}

export default NotFoundContent