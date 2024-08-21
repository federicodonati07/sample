'use client'
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
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
import UserManagement from "@/components/auth/private/userManagement"
import ShippingInfo from "@/components/auth/private/shippingInfo"

const Page = ()=>{
    const [user, setUser] = useState<User | null>(null)
    const [name, setName] = useState('---')
    const [surname, setSurname] = useState('---')
    const [email, setEmail] = useState('---')
    const [role, setRole] = useState('---')
    const [orders, setOrders] = useState('---')
    const [uuid, setUuid] = useState('')

    const [country, setCountry] = useState('---')
    const [state, setState] = useState('---')
    const [city, setCity] = useState('---')
    const [shippingAddress, setShippingAddress] = useState('---')
    const [houseNumber, setHouseNumber] = useState('---')
    const [apartamentNumber, setApartamentNumber] = useState('---')
    const [postalCode, setPostalCode] = useState('---')
    const [phoneNumber, setPhoneNumber] = useState('---')
    const [moreInfo, setMoreInfo] = useState('---')

    const router = useRouter()

    //  FUNCTION OF CODE BELOW  //
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibilityMenu = () => {
        setIsVisible(!isVisible);
    };


    //  SESSION LOGIC  //
    const getUserInfo = async(email)=>{
        const {data, error} = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email)
            .single()

        if (error) {
            console.error("Error fetching user info:", error);
        } else {
            setName(data.name)
            setSurname(data.surname)
            setRole(data.role)
            setOrders(data.orders)
        }
    }

    useEffect(()=>{
        const getSession = async()=>{
            const {data:{session}} = await supabase.auth.getSession()
            
            if(session){
                setUser(session.user)
                setUuid(session.user.id)
                setEmail(session.user.email!)
                getUserInfo(session.user.email)
            }else{
                router.push("/auth")
            }
        }

        getSession()

    }, [router])

    useEffect(()=>{
        const handleFetchShipping = async()=>{
            const {data, error} = await supabase
                .from("shipping_info")
                .select("*")
                .eq("profile_uuid", uuid)
                .single()

            if(data){
                setCountry(data.country)
                setState(data.state)
                setCity(data.city)
                setShippingAddress(data.address)
                setHouseNumber(data.house_number)
                setApartamentNumber(data.apartament_number)
                setPostalCode(data.postal_code)
                setPhoneNumber(data.phone_number)
                setMoreInfo(data.more_info)
            }
        }

        handleFetchShipping()
    }, [uuid])


    const handleLogout = async()=>{
        await supabase.auth.signOut()
        router.push("/auth")
    }

    if(!user) return null;
    return(
        <>
            <div className='flex flex-row justify-center items-center  text-white relative'>
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
            className={`text-white flex flex-row m-2 p-2 mt-10 transition-all duration-250 ease-in ${isVisible ? 'opacity-0' : 'opacity-100'}`}>
                <Button onClick={handleLogout} className="z-51 absolute top-0 left-0 m-2 bg-slate-50 text-slate-950 font-black">Logout</Button>
                
                <div className="border border-slate-50 rounded-lg w-full m-2">
                    <div className="grid grid-rows-3 gap-2">
                        <UserInfo
                            name={name}
                            surname={surname}
                            email={email}
                            role={role}
                            orders={orders}>
                            
                        </UserInfo>
                        <ShippingInfo
                            country={country}
                            state={state}
                            city={city}
                            address={shippingAddress}
                            house_number={houseNumber}
                            apartament_number={apartamentNumber}
                            postal_code={postalCode}
                            phone_number={phoneNumber}
                            more_info={moreInfo}
                            email={email}>
                        </ShippingInfo>
                        <UserManagement uuid={uuid} email={user.email}></UserManagement>
                    </div>
                    <div className="flex justify-center items-center text-center">
                        <span>User ID: {uuid}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page


