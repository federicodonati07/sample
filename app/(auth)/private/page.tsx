'use client'
import { useRouter } from "next/navigation"
import React, { useEffect, useState, useCallback } from "react"
import supabase from "@/lib/supabase/supabaseClient"
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import Link from 'next/link';
import { GoHome } from "react-icons/go";
import { AiOutlineProduct } from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import UserInfo from "@/components/auth/private/userInfo"
import EditShippingInfo from "@/components/auth/private/editShippingInfo"
import AddShippingInfo from "@/components/auth/private/addShippingInfo"
import { MdOutlineDashboard } from "react-icons/md";

const Page = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState({
        name: '---',
        surname: '---',
        email: '---',
        role: '---',
        orders: '---'
    });
    const [shipping, setShipping] = useState({
        country: '---',
        state: '---',
        city: '---',
        address: '---',
        house_number: '---',
        apartament_number: '---',
        postal_code: '---',
        phone_number: '---',
        more_info: '---'
    });
    const [uuid, setUuid] = useState('');
    const [isShippingSetted, setIsShippingSetted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    const toggleVisibilityMenu = () => {
        setIsVisible(prev => !prev);
    };

    const fetchUserInfo = useCallback(async (email) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email)
            .single();

        if (error) {
            console.error("Error fetching user info:", error);
        } else if (data) {
            setProfile(prev => ({
                ...prev,
                name: data.name || '---',
                surname: data.surname || '---',
                role: data.role || '---',
                orders: data.orders
            }));
        }
    }, []);

    const checkAndInsertProfileData = useCallback(async (email) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email);

        if (error) {
            console.error("Error checking profile data:", error.message);
            return;
        }

        if (data.length === 0) {
            const { error: insertError } = await supabase
                .from("profiles")
                .insert([{
                    name: "---",
                    surname: "---",
                    email,
                    role: "member",
                    orders: 0
                }]);

            if (insertError) {
                console.error("Error inserting profile data:", insertError.message);
            }
        }
    }, []);

    const fetchShippingInfo = useCallback(async (uuid) => {
        const { data, error } = await supabase
            .from("shipping_info")
            .select("*")
            .eq("profile_uuid", uuid)
            .single();

        if (data) {
            setShipping({
                country: data.country || '---',
                state: data.state || '---',
                city: data.city || '---',
                address: data.address || '---',
                house_number: data.house_number || '---',
                apartament_number: data.apartament_number || '---',
                postal_code: data.postal_code || '---',
                phone_number: data.phone_number || '---',
                more_info: data.more_info || '---'
            });
            setIsShippingSetted(true);
        } else {
            setIsShippingSetted(false);
        }
    }, []);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setUser(session.user);
                setUuid(session.user.id);
                const userEmail = session.user.email || '---';
                setProfile(prev => ({ ...prev, email: userEmail }));
                await fetchUserInfo(userEmail);
                await checkAndInsertProfileData(userEmail);
                await fetchShippingInfo(session.user.id);
            } else {
                router.push("/auth");
            }
        };

        getSession();
    }, [fetchUserInfo, checkAndInsertProfileData, fetchShippingInfo, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/auth");
    };

    if (!user) return null;

    return (
        <>
            <div className='flex flex-row justify-center items-center text-white relative'>
                <span className='m-2 text-2xl tracking-widest'>PRIVATE</span>
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
                            <GoHome className='mr-2 text-2xl' />Home
                        </span>
                    </Link>
                    <Link href="/private">
                        <span className="hover:underline flex flex-row">
                            <CiUser className='mr-2 text-2xl' />Profile
                        </span>
                    </Link>
                    <Link href="/collection">
                        <span className="hover:underline flex flex-row">
                            <AiOutlineProduct className='mr-2 text-2xl' />Collection
                        </span>
                    </Link>
                </div>
            </div>

            <div
                className={`text-white flex flex-row m-2 p-2 mt-10 transition-all duration-250 ease-in ${isVisible ? 'opacity-0' : 'opacity-100'}`}>
                <Button onClick={handleLogout} className="z-51 absolute top-0 left-0 m-2 bg-slate-50 text-slate-950 font-black">Logout</Button>

                <div className="border border-slate-50 rounded-lg w-full m-2">
                    <div className="flex flex-col gap-2">
                        {profile.role === "admin" && (
                            <div className="m-2">
                                <Link href="/private/dashboard">
                                    <Button className="bg-slate-50 text-slate-950">
                                        <MdOutlineDashboard className="text-black" />
                                        Dashboard
                                    </Button>
                                </Link>
                            </div>
                        )}
                        <UserInfo
                            name={profile.name}
                            surname={profile.surname}
                            email={profile.email}
                            role={profile.role}
                            orders={profile.orders}
                        />
                        {isShippingSetted ? (
                            <EditShippingInfo
                                country={shipping.country}
                                state={shipping.state}
                                city={shipping.city}
                                address={shipping.address}
                                house_number={shipping.house_number}
                                apartament_number={shipping.apartament_number}
                                postal_code={shipping.postal_code}
                                phone_number={shipping.phone_number}
                                more_info={shipping.more_info}
                                uuid={uuid}
                            />
                        ) : (
                            <AddShippingInfo uuid={uuid} email={user.email} />
                        )}
                    </div>
                    <div className="flex justify-center items-center text-center">
                        <span>User ID: {uuid}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page;
