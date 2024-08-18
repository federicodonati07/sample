'use client'
import React, { useState } from 'react';
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import Link from 'next/link';
import { GoHome } from "react-icons/go";
import { AiOutlineProduct } from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import Login from '@/components/auth/login';
import Signup from '@/components/auth/signup';

const Page = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMethod, setIsMethod] = useState ("login")

    const toggleMethod = ()=>{
        if(isMethod == "login"){
            setIsMethod("signup")
        }else{
            setIsMethod("login")
        }
    }

    const toggleVisibilityMenu = () => {
        setIsVisible(!isVisible);
    };

    return (
        <>
            <div className='flex flex-row justify-center items-center  text-white relative'>
                <span className='m-2 text-2xl tracking-widest'>SAMPLE</span>
                <div className="absolute top-0 right-0 m-4">
                    <CiMenuBurger
                        onClick={toggleVisibilityMenu}
                        className={`cursor-pointer text-2xl transition-opacity duration-300 ${isVisible ? 'opacity-0' : 'opacity-100'}`}
                    />
                </div>
            </div>
            <div 
                className={`overflow-hidden z-50 text-white border border-slate-50 rounded-lg absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${isVisible ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="flex flex-col items-center p-6 m-6 space-y-4 font-black">
                    <IoCloseOutline
                        onClick={toggleVisibilityMenu}
                        className={`cursor-pointer text-4xl transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <Link href="/">
                        <span className="hover:underline flex flex-row">
                            <GoHome className='mr-2 text-2xl'/>Home
                        </span>
                    </Link>
                    <Link href="/private">
                        <span className="hover:underline flex flex-row">
                            <CiUser className='mr-2 text-2xl'/>Profile
                        </span>
                    </Link>
                    <Link href="/collection">
                        <span className="hover:underline flex flex-row">
                            <AiOutlineProduct className='mr-2 text-2xl'/>Collection
                        </span>
                    </Link>
                </div>
            </div>

            <div
            className={`text-white justify-center items-center flex flex-row ml-2 mt-36 transition-all duration-250 ease-in ${isVisible ? 'opacity-0' : 'opacity-100'}`}>
                {isMethod === "login" ? (
                    <>
                        <div className='flex flex-col justify-center items-center text-center'>
                            <span className='text-xl tracking-widest'>LOGIN</span>
                            
                            <div className='m-1 flex justify-center items-center'>
                                <Login></Login>
                            </div>

                            <span className='text-xs'>don't have an account yet? 
                                <span onClick={toggleMethod} className='underline cursor-pointer'> SIGNUP</span>
                            </span>
                        </div>  
                    </>
                ) : isMethod === "signup" ? (
                    <>
                        <div className='flex flex-col justify-center items-center text-center'>
                            <span className='text-xl tracking-widest'>SIGNUP</span>
                            
                            <div className='m-1 flex justify-center items-center'>
                                <Signup></Signup>
                            </div>
                            
                            <span className='text-xs'>are you already a member? 
                                <span onClick={toggleMethod} className='underline cursor-pointer'> LOGIN</span>
                            </span>
                        </div>
                    </>
                ) : ""}
            </div>
        </>
    );
};

export default Page;
