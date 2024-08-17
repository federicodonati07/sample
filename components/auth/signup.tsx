import React from 'react'
import {Input} from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '@radix-ui/react-label'
import { FcGoogle } from "react-icons/fc";
import { useState } from 'react';

const Signup = () => {
    const [isSection, setIsSection] = useState("signup")

    const toggleSection = ()=>{
        if(isSection == "signup"){
            setIsSection("shipping")
        }else{
            setIsSection("signup")
        }
    }

  return (
    <>
        

        <div className='m-1 w-full'>
            
            {isSection === "signup" ? (
                <>
                    <Label htmlFor='email' className='text-sm'>email <span className='text-red-600 text-xs font-black'>*</span></Label>
                    <Input id="email" type="email" placeholder='ex. mail@gmail.com'></Input>
                    
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label htmlFor='password' className='text-sm'>password <span className='text-red-600 text-xs font-black'>*</span></Label>
                            <Input id="password" type="password" placeholder='password'></Input>
                        </div>
                        <div>
                            <Label htmlFor='password' className='text-sm'>confirm password <span className='text-red-600 text-xs font-black'>*</span></Label>
                            <Input id="password" type="password" placeholder='confirm password'></Input>
                        </div>
                    </div>
                </>
            ) : isSection === "shipping" ? (
                <>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label htmlFor='city' className='text-sm'>city <span className='text-red-600 text-xs font-black'>*</span></Label>
                            <Input id="city" type="text" placeholder='city'></Input>
                        </div>
                        <div>
                            <Label htmlFor='shippingAddress' className='text-sm'>shipping address <span className='text-red-600 text-xs font-black'>*</span></Label>
                            <Input id="shippingAddress" type="text" placeholder='shipping address'></Input>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label htmlFor='houseNumber' className='text-sm'>house number <span className='text-red-600 text-xs font-black'>*</span></Label>
                            <Input id="houseNumber" type="text" placeholder='house number'></Input>
                        </div>
                        <div>
                            <Label htmlFor='postalCode' className='text-sm'>postal code <span className='text-red-600 text-xs font-black'>*</span></Label>
                            <Input id="postalCode" type="number" placeholder='postal code'></Input>
                        </div>
                    </div>
                    <Label htmlFor='moreInfo' className='text-sm'>more information for delivery <span className='text-red-600 text-xs font-black'>*</span></Label>
                    <Input id="moreInfo" type="textarea" placeholder='+ more information for delivery'></Input>
                </>
            ) : ""}
            <div className='flex flex-row justify-center items-center mt-2'>
                {isSection === "signup" ? (
                    <>
                        <Button className='bg-slate-50 text-slate-950 mt-2 font-black'>
                            <FcGoogle className='m-1' />
                                Signup with Google
                            </Button>
                        <span className='m-2 my-3'>or</span>
                        <Button onClick={toggleSection} className='bg-slate-50 text-slate-950 mt-2 font-black'>Next 1 of 2</Button>
                    </>
                ) : isSection === "shipping" ? (
                    <>
                        <Button onClick={toggleSection} className='bg-slate-50 text-slate-950 mt-2 font-black'>Before 1 of 2</Button>
                        <span className='m-2 my-3'>or</span>
                        <Button className='bg-slate-50 text-slate-950 mt-2 font-black'>Signup</Button>
                    </>
                ) : ""}
                
            </div>  
        </div>
    </>
  )
}

export default Signup