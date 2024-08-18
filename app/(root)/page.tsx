'use client'
import React, { useState } from 'react';
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import Link from 'next/link';
import { GoHome } from "react-icons/go";
import { AiOutlineProduct } from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import Catalog from '@/components/home/catalog';

const Page = () => {
    const [isVisible, setIsVisible] = useState(false);

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
            className={`text-white flex flex-row ml-2 mt-10 transition-all duration-250 ease-in ${isVisible ? 'opacity-0' : 'opacity-100'}`}>
                <Catalog></Catalog>
            </div>
        </>
    );
};

export default Page;
