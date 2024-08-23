import React, { useEffect, useState } from 'react'
import { MdOutlineEdit } from 'react-icons/md';
import InfoEdit from './infoEdit';
import {Input} from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import supabase from '@/lib/supabase/supabaseClient';


const UserInfo = ({name, surname, email, role, orders}) => {
    const [inputNameValue, setInputNameValue] = useState(`${name}`)
    const [inputSurnameValue, setInputSurnameValue] = useState(`${surname}`)

    const handleEdit = async()=>{
        if(inputNameValue !== '' || inputSurnameValue !== ''){
            const {data, error} = await supabase
                .from("profiles")
                .select("*")
                .eq("email", email)

            if(error){
                window.location.href = "/private"
            }

            if(data?.length == 0){
                const {data, error} = await supabase
                    .from("profiles")
                    .insert([{
                        name: inputNameValue,
                        surname: inputSurnameValue,
                        email: email
                    }])

                if(error){
                    window.location.href = "/private"
                }

            }else{
                const {data, error} = await supabase
                    .from("profiles")
                    .update([{
                        name: inputNameValue,
                        surname: inputSurnameValue
                    }])
                    .eq("email", email)
                    .single()

                if(error){
                    window.location.href = "/private"
                }
            }
        }
    }

    useEffect(()=>{
        setInputNameValue(name)
        setInputSurnameValue(surname)
    }, [name, surname])

    return (
        <>
            <div className="border-slate-50 border-b">
                <div className="flex flex-col justify-center items-center text-center">
                    <div className="p-2">
                        <span className="font-black">User Information</span>
                    </div>
                    <div className="overflow-auto flex flex-col justify-start items-start text-start p-2 ">
                        <div className='grid grid-cols-2 mb-2 p-2'>
                            <span className='text-xl mx-2'>Name:</span>
                            <Input 
                                type="text"
                                value={inputNameValue}
                                onChange={(e) => setInputNameValue(e.target.value)}
                                placeholder="Insert a value"
                                className='font-black'>    
                            </Input>
                        </div>
                        <div className='grid grid-cols-2 mb-2 border-slate-50 border-b p-2'>
                            <span className='text-xl mx-2'>Surname:</span>
                            <Input
                                type="text"
                                value={inputSurnameValue}
                                onChange={(e)=>setInputSurnameValue(e.target.value)}
                                placeholder='Insert a value'
                                className='font-black'>    
                            </Input>
                        </div>
                        <div className='mx-2'>
                            <span className='text-xl'>Email: <span className="font-black text-md opacity-50">{email}</span></span>
                            
                        </div>
                        <div className='mx-2'>
                            <span className='text-xl'>Role: <span className={`font-black text-md opacity-50 ${role === "admin" ? 'text-cyan-600' : role === "veteran" ? 'text-violet-600' : role === "member" ? 'text-green-600' : role === "banned" ? "text-red-600" : ""}`}>{role}</span></span>
                        </div>
                        <div className='mx-2'>
                            <span className='text-xl'>Orders: <span className="font-black text-md opacity-50">{orders}</span></span>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <Button onClick={handleEdit} className='bg-slate-50 text-slate-950 m-2'>Edit User Info</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserInfo