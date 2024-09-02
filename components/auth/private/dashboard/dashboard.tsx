import supabaseAdmin from '@/lib/supabase/supabaseAdmin'
import React, { useEffect, useState } from 'react'
import Counter from './counter'
import supabase from '@/lib/supabase/supabaseClient'
import BelowSection from './belowSection'
import TotalOrders from './totalOrders'

const Dashboard = ({user, email}) => {
    const [name, setName] = useState("---")
    const [surname, setSurname] = useState("---")
    const [number, setNumber] = useState(0)
    const [orders, setOrders] = useState(0)
    const [notifications, setNotifications] = useState(0)
    const [section, setSection] = useState('users')

    const handleSection = (section:string)=>{
        setSection(section)
    }

    useEffect(()=>{
        const getNotificationsCount = async ()=>{
            const {data, error} = await supabase
                .from('orders')
                .select("*")
                .eq('order_status', "unread")

            if(data){
               setNotifications(data!.length)
            }else{
                setNotifications(0)
            }
            
        }

        const getProfileCount = async ()=>{
            const {data, error} = await supabaseAdmin.auth.admin.listUsers()

            setNumber(data.users.length)
        }

        const getOrdersCount = async ()=>{
            const {data, error} = await supabase
                .from("orders")
                .select("*")
                
            if(data){
                setOrders(data!.length)
            }else{
                setOrders(0)
            }
        }

        const fetchProfileInfo = async ()=>{
            const {data, error} = await supabase
                .from("profiles")
                .select("*")
                .eq("email", email)
                .single()

            if(data){
                setName(data.name)
                setSurname(data.surname)
            }
        }
        fetchProfileInfo()
        getProfileCount()
        getOrdersCount()
        getNotificationsCount()


    }, [email, user])

    return (
        <>
            <div className='flex flex-col justify-center items-center m-2'>
                <div className='flex flex-col lg:block '>
                    <span className='text-2xl font-black m-2'>DashBoard</span>
                    <span className='text-sm m-2'>Hi {name} {surname}</span>
                </div>
                <div className='grid grid-cols-3 justify-center items-center text-center lg:grid lg:grid-cols-3 lg:gap-10'>
                    <div 
                         onClick={(e)=>handleSection('torders')}
                        className='transition-all ease-in-out duration-200 mt-20 p-4 flex flex-col justify-center items-center cursor-pointer border border-red-600 bg-red-600 text-slate-50 shadow-lg shadow-red-600 hover:text-red-600 hover:bg-transparent'>
                        <Counter n={orders}></Counter>
                        <span className='font-black text-sm'>Total Orders</span>
                    </div>
                    <div
                        onClick={(e)=>handleSection('users')}
                        className='transition-all ease-in-out duration-200 mt-20 p-4 flex flex-col justify-center items-center cursor-pointer border border-slate-50 bg-slate-50 text-slate-950 shadow-lg shadow-slate-50 hover:text-slate-50 hover:bg-transparent'>
                        <Counter n={number}></Counter>
                        <span className='font-black text-sm'>Total Users</span>
                    </div>
                    <div 
                         onClick={(e)=>handleSection('notifications')}
                        className='transition-all ease-in-out duration-200 mt-20 p-4 flex flex-col justify-center items-center cursor-pointer border border-yellow-600 bg-yellow-600 text-slate-50 shadow-lg shadow-yellow-600 hover:text-yellow-600 hover:bg-transparent'>
                        <Counter n={notifications}></Counter>
                        <span className='font-black text-sm'>New Notifications</span>
                    </div>
                </div>

                {section === "users" ? (
                    <>
                        <div className='md:absolute  md:top-1/2'>
                            <BelowSection currentEmail={email}></BelowSection>
                        </div>
                    </>
                ) : section === "torders" ? (
                    <>  
                        <div className='md:absolute  md:top-1/2 overflow-y-auto w-full h-auto'>
                            <TotalOrders></TotalOrders>
                        </div>
                    </>
                ) : section === "notifications" ? (
                    <>

                    </>
                ) : ""}
                
            </div>
        </>
    )
}

export default Dashboard