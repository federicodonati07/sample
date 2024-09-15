import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns'; // Formattazione della data americana
import { FiCalendar, FiBox } from 'react-icons/fi'; // Icone da react-icons
import { RxCross2 } from 'react-icons/rx'; // Icona per step non raggiunto
import { FaCheck } from 'react-icons/fa6'; // Icona per step raggiunto
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const ProfileOrder = ({ open, onOpenChange, uuid, orders }) => {
    // Funzione per formattare la data in stile americano con ore e minuti
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'Pp'); // Formattazione americana con data e ora
    };

    const steps = ['Sended', 'Processing', 'Shipped', 'Delivered'];

    // Mappatura degli stati dell'ordine con lo stepper
    const getStepFromStatus = (status) => {
        switch (status) {
            case 'processing':
                return 2;
            case 'shipped':
                return 3;
            case 'delivered':
                return 4;
            default:
                return 1; // Per lo stato iniziale o non definito
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="bg-gray-900 text-slate-50 flex flex-col justify-center items-center">
                <SheetHeader className="border-b border-slate-50 mb-6">
                    <SheetTitle className="text-slate-50 text-3xl font-bold">Your Orders</SheetTitle>
                    <SheetDescription className="text-slate-400 text-base mt-2">
                        Review and track the status of your recent orders.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col w-full px-6 space-y-6 overflow-y-auto">
                    {orders.map((order, index) => {
                        const currentStep = getStepFromStatus(order.order_status);
                        return (
                            <div 
                                key={index} 
                                className={`bg-gradient-to-tr
                                    ${order.order_status === "cancelled" ? "from-red-500 to-red-700" : 
                                        order.order_status === "archived" ? "from-slate-500 to-slate-700" : 
                                        "bg-transparent text-slate-50"}
                                        border border-slate-50 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-2xl p-2 
                                    `}
                            >
                                {order.order_status === "archived" ? (
                                    <>
                                        <div className='overflow-auto'>
                                            <div className="mb-4 flex items-center space-x-3">
                                                <span className="text-lg font-bold text-slate-100">Order Archived:</span>
                                                <p className="text-slate-200">{order.order_uuid}</p>
                                            </div>
                                            <div className="mb-4 flex items-center space-x-3">
                                                <FiBox className="text-2xl text-slate-100" />
                                                <span className="text-lg font-bold text-slate-100">Product ID:</span>
                                                <p className="text-slate-200">{order.product_uuid}</p>
                                            </div>
                                        </div>
                                    </>
                                ) : order.order_status === "cancelled" ? (
                                    <>
                                        <div className='overflow-auto'>
                                            <div className="mb-4 flex items-center space-x-3">
                                                <span className="text-lg font-bold text-slate-100">Order Cancelled Number:</span>
                                                <p className="text-slate-200">{order.order_uuid}</p>
                                            </div>
                                            <div className="mb-4 flex items-center space-x-3">
                                                <FiBox className="text-2xl text-slate-100" />
                                                <span className="text-lg font-bold text-slate-100">Product ID:</span>
                                                <p className="text-slate-200">{order.product_uuid}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <FiCalendar className="text-2xl text-slate-100" />
                                                <span className="text-lg font-bold text-slate-100">Sent at:</span>
                                                <p className="text-slate-200">{formatDate(order.created_at)}</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className='overflow-auto'>
                                            <div className='flex justify-center items-center mb-2'>
                                                <span className='text-slate-50 font-black'>{formatDate(order.created_at)}</span>
                                            </div>
                                            
                                            <div className='flex justify-between'>
                                                {steps.map((step, i) => (
                                                    <div key={i} className={`relative flex flex-col justify-center items-center w-36
                                                        ${i < (currentStep || 1) ? "text-sky-600" : "text-slate-400"}
                                                        [&:not(:first-child)]:before:bg-slate-200 before:absolute before:w-full before:h-[3px] before:right-2/4 before:top-1/3 before:-translate-y-2/4
                                                    `}>
                                                        <div className={`w-10 h-10 flex items-center justify-center z-10 relative rounded-full font-semibold 
                                                            ${i < (currentStep || 1) ? "bg-sky-600 text-slate-50" : "bg-slate-700 text-slate-50"}
                                                        `}>
                                                            {i < (currentStep || 1) ? <FaCheck /> : <RxCross2 />}
                                                        </div>
                                                        <span className='text-sm mr-2'>{step}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                <SheetFooter className="w-full flex justify-center mt-8">
                    <SheetClose asChild>
                        <Button className="text-lg font-bold bg-sky-600 px-10 py-3 rounded-full text-white border border-sky-600 hover:bg-transparent hover:text-sky-600 hover:shadow-lg transition-all">
                            Back
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default ProfileOrder;
