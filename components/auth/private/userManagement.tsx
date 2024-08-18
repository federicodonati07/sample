import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MdOutlineEdit } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import SignupSec2 from '../signupSections/signupSec2';

const UserManagement = ({uuid}) => {
    const handleShipping = async()=>{
        
    }

    return (
        <>
            <div>
                <div>
                    <div className="flex flex-col justify-center items-center text-center">
                        <div className="p-2">
                            <span className="font-black">User Management</span>
                        </div>
                        <div className="overflow-auto grid grid-cols-2 mt-5 gap-2">
                            <Button className="bg-yellow-600"><MdOutlineEdit className="text-xl font-black" />Edit Profile</Button>
                            <AlertDialog>
                                <AlertDialogTrigger><Button className="bg-blue-600"><FaShippingFast className="text-xl font-black"/> Add Shipping Info</Button></AlertDialogTrigger>
                                <AlertDialogContent className='bg-slate-950'>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Add Shipping Info</AlertDialogTitle>
                                    <AlertDialogDescription className='text-slate-50 font-black'>
                                        
                                        <SignupSec2></SignupSec2>
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className='text-slate-950 font-black'>Cancel</AlertDialogCancel>
                                        <Button onClick={handleShipping} className='bg-blue-600 font-black'><FaShippingFast className="text-xl font-black" /> Add</Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserManagement