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
                <div>
                    <span className='text-2xl font-black m-2'>DashBoard</span>
                    <span className='text-sm m-2'>Hi {name} {surname}</span>
                </div>
                <div>
                    <Counter toN={number}></Counter>
                </div>
            </div>
        </>
    )
}

export default Dashboard