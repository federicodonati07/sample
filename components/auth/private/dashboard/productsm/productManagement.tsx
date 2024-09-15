import supabaseAdmin from '@/lib/supabase/supabaseAdmin';
import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabase/supabaseClient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ProductManagement = ({ user, email }) => {
    const [name, setName] = useState("---");
    const [surname, setSurname] = useState("---");

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
            </div>
        </>
    );
};

export default ProductManagement;
