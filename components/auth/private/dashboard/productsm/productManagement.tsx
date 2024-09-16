import supabaseAdmin from '@/lib/supabase/supabaseAdmin';
import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabase/supabaseClient';
import { Button } from '@/components/ui/button';
import { CiSquarePlus } from "react-icons/ci";
import { ToastContainer, toast } from 'react-toastify';
import AddProductForm from '../orderSection/profileOrderSection/addProductForm';

const ProductManagement = ({ user, email }) => {
    const [name, setName] = useState("---");
    const [surname, setSurname] = useState("---");
    const [isAddOrderOpen, setIsAddOrderOpen] = useState(false)

    const handleAddOrderChange = (open: boolean)=>{
        setIsAddOrderOpen(open)
    }
    const handleAddOrder = ()=>{
        setIsAddOrderOpen(true)
    }

    useEffect(() => {
        const fetchProfileInfo = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("email", email)
                .single();

            if (data) {
                setName(data.name);
                setSurname(data.surname);
            }
        };

        fetchProfileInfo();
    }, [email, user]);

    return (
        <>
            <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen">
                <div className='flex flex-rows'>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-lg text-gray-400">Hi {name} {surname}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                    <div className="w-full mt-8 overflow-auto">
                        <Button onClick={handleAddOrder} className='transition-all ease-in duration-300 font-bold text-slate-950 bg-slate-50 border border-slate-50 rounded-full hover:text-slate-50 hover:bg-transparent'>
                            <CiSquarePlus className='font-bold text-xl mr-1'/>
                            Add Product
                        </Button>
                    </div>
                </div>
                <AddProductForm 
                    open={isAddOrderOpen}
                    onOpenChange={handleAddOrderChange}/>
            </div>
            <ToastContainer />
        </>
    );
};

export default ProductManagement;
