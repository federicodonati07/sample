import React from 'react'

const UserInfo = ({name, surname, email, role, orders}) => {
  return (
    <>
        <div className="border-slate-50 border-b">
            <div className="flex flex-col justify-center items-center text-center">
                <div className="p-2">
                    <span className="font-black">User Information</span>
                </div>
                <div className="overflow-auto flex flex-col justify-start items-start text-start p-2 ">
                    <span>Name: <span className="font-black">{name}</span></span>
                    <span>Surname: <span className="font-black">{surname}</span></span>
                    <span>Email: <span className="font-black">{email}</span></span>
                    <span>Role: <span className={`font-black ${role === "admin" ? 'text-cyan-600' : role === "veteran" ? 'text-violet-600' : role === "member" ? 'text-green-600' : role === "banned" ? "text-red-600" : ""}`}>{role}</span></span>
                    <span>Orders: <span className="font-black">{orders}</span></span>
                </div>
            </div>
        </div>
    </>
  )
}

export default UserInfo