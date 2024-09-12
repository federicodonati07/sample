import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const ProfileOrder = ({open, onOpenChange, uuid, orders}) => {
    const test = ()=>{
        console.log(uuid, orders)
    }

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className='bg-gray-900 text-slate-50 flex flex-col justify-center items-center'>
                    <SheetHeader className='border-b border-slate-50'>
                        <SheetTitle className='text-slate-50 text-xl'>Your Orders</SheetTitle>
                        <SheetDescription className='text-slate-50 text-small'>
                            Manage all your orders and see where they stand.
                        </SheetDescription>
                    </SheetHeader>
                    <div className='flex flex-col'>
                        {}
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button onClick={test} className='mt-2 text-lg font-black bg-slate-50 border border-slate-50 rounded-full text-slate-950 hover:bg-transparent hover:text-slate-50'>Save changes</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
                </Sheet>
        </>
    )
}

export default ProfileOrder