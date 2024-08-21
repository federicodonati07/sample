import React, { useState } from 'react'
import { MdOutlineEdit } from 'react-icons/md';
import InfoEdit from './infoEdit';


const UserInfo = ({name, surname, email, role, orders}) => {
    const [visibleEditName, setVisibleEditName] = useState("noVisible")
    const [visibleEditSurname, setVisibleEditSurname] = useState("noVisible")

    const handleEditName = ()=>{
        setVisibleEditName("yesVisible")
    }
    const handleEditSurname = ()=>{
        setVisibleEditSurname("yesVisible")
    }

    return (
        <>
            <div className="border-slate-50 border-b">
                <div className="flex flex-col justify-center items-center text-center">
                    <div className="p-2">
                        <span className="font-black">User Information</span>
                    </div>
                    <div className="overflow-auto flex flex-col justify-start items-start text-start p-2 ">
                        <div className='flex flex-row'>
                            <span className={`${visibleEditName === "noVisible" ? "block" : "hidden"}`}>Name: <span className="font-black">{name}</span></span>
                            <MdOutlineEdit onClick={()=>handleEditName()} className={`text-xl font-black mx-2 ${visibleEditName === "noVisible" ? "block" : "hidden"}`}/>
                            {visibleEditName === "noVisible" ? "" : (
                                <InfoEdit id="name" email={email} old={name} placeH="New Name"></InfoEdit>
                            )}
                        </div>
                        <div className='flex flex-row'>
                            <span className={`${visibleEditSurname === "noVisible" ? "block" : "hidden"}`}>Surname: <span className="font-black">{surname}</span></span>
                            <MdOutlineEdit onClick={()=>handleEditSurname()} className={`text-xl font-black mx-2 ${visibleEditSurname === "noVisible" ? "block" : "hidden"}`}/>
                            {visibleEditSurname === "noVisible" ? "" : (
                                <InfoEdit id="surname" email={email} old={surname} placeH="New Name"></InfoEdit>
                            )}
                        </div>
                        <div>
                            <span>Email: <span className="font-black opacity-50">{email}</span></span>
                        </div>
                        <div>
                            <span>Role: <span className={`font-black opacity-50 ${role === "admin" ? 'text-cyan-600' : role === "veteran" ? 'text-violet-600' : role === "member" ? 'text-green-600' : role === "banned" ? "text-red-600" : ""}`}>{role}</span></span>
                        </div>
                        <div>
                            <span>Orders: <span className="font-black opacity-50">{orders}</span></span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserInfo