'use client'

import React, { useState } from 'react';
import { LiaMaleSolid } from "react-icons/lia";
import { LiaFemaleSolid } from "react-icons/lia";
import { FaMale } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";

const Catalog = () => {
    const [isSex, setIsSex] = useState("male");

    const handleSexFilterSetMale = () => {
        setIsSex("male");
    }

    const handleSexFilterSetFemale = () => {
        setIsSex("female");
    }

    return (
        <>
            <div className='flex flex-row justify-center items-center text-white relative'>
                <div className='flex flex-row'>
                    <span>Sort by: </span>
                    {
                        isSex === "male" ? (
                            <>
                                <div className='border rounded-lg p-2 m-1'>
                                    <FaMale/>
                                </div>
                                <div className='border rounded-lg p-2 m-1'>
                                    <LiaFemaleSolid onClick={handleSexFilterSetFemale}/>
                                </div>
                            </>
                        ) : isSex === "female" ? (
                            <>
                                <div className='border rounded-lg p-2 m-1'>
                                    <LiaMaleSolid onClick={handleSexFilterSetMale}/>
                                </div>
                                <div className='border rounded-lg p-2 m-1'>
                                    <FaFemale/>
                                </div>
                            </>
                        ) : ""
                    }
                </div>
                <div>
                    
                </div>
            </div>
        </>
    );
}

export default Catalog;
