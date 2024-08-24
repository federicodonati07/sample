import supabaseAdmin from '@/lib/supabase/supabaseAdmin'
import React, { useEffect, useState } from 'react'
import Counter from './counter'
import supabase from '@/lib/supabase/supabaseClient'

const Dashboard = ({user, email}) => {
    const [name, setName] = useState("---")
    const [surname, setSurname] = useState("---")
    const [number, setNumber] = useState("---")

    useEffect(()=>{
        const getProfileCount = async ()=>{
            const {data, error} = await supabaseAdmin.auth.admin.listUsers()

            setNumber(data.total)
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

    }, [email, user])

    return (
        <>
            <div className='flex flex-col justify-center items-center m-2'>
                <div className='flex flex-col lg:block '>
                    <span className='text-2xl font-black m-2'>DashBoard</span>
                    <span className='text-sm m-2'>Hi {name} {surname}</span>
                </div>
                <div className='grid grid-cols-2 gap-10'>
                    <div className='transition-all ease-in-out duration-200 mt-20 p-4 flex-flex-col justify-center items-center cursor-pointer border border-red-600 bg-red-600 text-slate-50 shadow-lg shadow-red-600 hover:text-slate-50 hover:bg-transparent'>
                        <span></span>
                    </div>
                    <div className='transition-all ease-in-out duration-200 mt-20 p-4 flex flex-col justify-center items-center cursor-pointer border border-slate-50 bg-slate-50 text-slate-950 shadow-lg shadow-slate-50 hover:text-slate-50 hover:bg-transparent'>
                        <Counter toN={number}></Counter>
                        <span className='font-black'>Users</span>
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default Dashboard