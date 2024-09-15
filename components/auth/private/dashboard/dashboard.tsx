import supabaseAdmin from '@/lib/supabase/supabaseAdmin';
import React, { useEffect, useState } from 'react';
import Counter from './counter';
import supabase from '@/lib/supabase/supabaseClient';
import BelowSection from './belowSection';
import TotalOrders from './totalOrders';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Dashboard = ({ user, email }) => {
    const [name, setName] = useState("---");
    const [surname, setSurname] = useState("---");
    const [number, setNumber] = useState(0);
    const [orders, setOrders] = useState(0);
    const [notifications, setNotifications] = useState(0);
    const [section, setSection] = useState('users');

    const handleSection = (section: string) => {
        setSection(section);
    };

    useEffect(() => {
        const getNotificationsCount = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select("*")
                .eq('order_status', "unread");

            setNotifications(data ? data.length : 0);
        };

        const getProfileCount = async () => {
            const { data, error } = await supabaseAdmin.auth.admin.listUsers();

            setNumber(data.users.length);
        };

        const getOrdersCount = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("*");

            setOrders(data ? data.length : 0);
        };

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
        getProfileCount();
        getOrdersCount();
        getNotificationsCount();
    }, [email, user]);

    return (
        <>
            <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen">
                <div className='flex flex-rows'>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-lg text-gray-400">Hi {name} {surname}</p>
                        <Link href="/private/dashboard/productsm">
                            <Button className='bg-slate-50 text-slate-950 font-bold border border-slate-50 rounded-full hover:text-slate-50 hover:bg-transparent '>Manage Products</Button>
                        </Link>
                    </div>    
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                    <div
                        onClick={() => handleSection('torders')}
                        className="transition-transform transform hover:scale-105 p-6 bg-red-600 text-white rounded-lg shadow-lg cursor-pointer hover:bg-red-700"
                    >
                        <Counter n={orders} />
                        <p className="mt-2 font-bold text-xl">Total Orders</p>
                    </div>

                    <div
                        onClick={() => handleSection('users')}
                        className="transition-transform transform hover:scale-105 p-6 bg-slate-50 text-slate-950 rounded-lg shadow-lg cursor-pointer hover:bg-slate-200"
                    >
                        <Counter n={number} />
                        <p className="mt-2 font-bold text-xl">Total Users</p>
                    </div>

                    <div
                        className="transition-transform transform hover:scale-105 p-6 bg-yellow-600 text-white rounded-lg shadow-lg cursor-pointer hover:bg-yellow-700"
                    >
                        <Counter n={notifications} />
                        <p className="mt-2 font-bold text-xl">New Notifications</p>
                    </div>
                </div>

                <div className="w-full mt-8 overflow-auto">
                    {section === "users" && (
                        <BelowSection currentEmail={email} />
                    )}
                    {section === "torders" && (
                        <TotalOrders />
                    )}
                    {section === "notifications" && (
                        <div className="p-4 bg-gray-800 text-gray-200 rounded-lg">
                            {/* Placeholder for notifications */}
                            <p>No notifications available.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
