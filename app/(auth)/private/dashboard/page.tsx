'use client'
import supabase from '@/lib/supabase/supabaseClient'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Dashboard from '@/components/auth/private/dashboard/dashboard'

const Page = () => {
    const [user, setUser] = useState<User | null>(null)
    const [email, setEmail] = useState('---')

    const [isValidRole, setIsValidRole] = useState(false)

    const router = useRouter()

    useEffect(()=>{
        const getSession = async ()=>{
            const {data:{session}} = await supabase.auth.getSession()

            if(session){
                setUser(session.user)
                setEmail(session.user.email!)

                const {data, error} = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("email", session.user.email!)
                    .single()
                
                if(data){
                    if(data.role == "admin"){
                        setIsValidRole(true)
                    }else{
                        router.push("/private")
                    }
                }else{
                    router.push("/private")
                }
            }else{
                router.push("/private")
            }
        }

        getSession()
    }, [router, email])

    if(!user) return null;

    return (
        <>
            {isValidRole ? (
                <>
                    <div className='flex flex-col justify-center items-center'>
                        <Dashboard user={user} email={email}></Dashboard>
                    </div>
                </>
            ) : (
                <>
                    <div className='flex flex-row justify-center items-center m-2'>
                        <span className='text-xl font-black'>you are not authorized</span>
                        <Link href="/private">
                            <Button className='bg-slate-50 text-slate-950 font-black'>Back</Button>
                        </Link>
                    </div>
                </>
            )}
        </>
    )
}

export default Page