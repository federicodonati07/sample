'use client'
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import supabase from "@/lib/supabase/supabaseClient"
import { User } from "@supabase/supabase-js"

const Page = ()=>{
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(()=>{
        const getSession = async()=>{
            const {data:{session}} = await supabase.auth.getSession()
            
            if(session){
                setUser(session.user)
            }else{
                router.push("/auth")
            }
        }

        getSession()

    }, [router])


    const handleLogout = async()=>{
        await supabase.auth.signOut()
        router.push("/auth")
    }

    if(!user) return null;

    return(
        <>
            <div>
                private
            </div>
        </>
    )
}

export default Page