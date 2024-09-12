import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { BiWorld } from "react-icons/bi";
import { CgBorderTop } from "react-icons/cg";
import { FaCity } from "react-icons/fa";
import { PiRoadHorizonFill } from "react-icons/pi";
import { TbNumber } from "react-icons/tb";
import { FaHouseFlag } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { Country, State } from 'country-state-city';
import ReactCountryFlag from "react-country-flag";

const OrderShippingInfo = ({ open, onOpenChange, email, country, state, city, address, houseNumber, apartmentNumber, postalCode, phoneNumber, moreInfo }) => {
    const [countryName, setCountryName] = useState('');
    const [stateName, setStateName] = useState('');

    useEffect(() => {
        const selectedCountry = Country.getCountryByCode(country);
        const selectedState = State.getStateByCodeAndCountry(state, country);

        if (selectedCountry) {
            setCountryName(selectedCountry.name);
        }
        if (selectedState) {
            setStateName(selectedState.name);
        }
    }, [country, state]);

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className='bg-zinc-900'>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className='text-center'>Shipping Info</DrawerTitle>
                        <DrawerDescription className='text-center'>of {email}</DrawerDescription>
                    </DrawerHeader>
                    <div className='flex flex-col justify-center items-start text-left m-2'>
                        <span className='flex flex-row space-x-2 items-center'>
                            <BiWorld className='text-4xl font-black' />
                            <span>{countryName}</span>
                            <ReactCountryFlag countryCode={country} svg style={{ width: '2em', height: '2em' }} />
                        </span>
                        <span className='flex flex-row space-x-2 items-center'>
                            <CgBorderTop className='text-4xl font-black' />
                            <span>{stateName}</span>
                        </span>
                        <span className='flex flex-row space-x-2 items-center'>
                            <FaCity className='text-4xl font-black' />
                            <span>{city}</span>
                        </span>
                        <span className='flex flex-row space-x-2 items-center'>
                            <PiRoadHorizonFill className='text-4xl font-black' />
                            <span>{address}</span>
                        </span>
                        <span className='flex flex-row space-x-2 items-center'>
                            <TbNumber className='text-4xl font-black' />
                            <span>{houseNumber}</span>
                        </span>
                        <span className='flex flex-row space-x-2 items-center'>
                            <FaHouseFlag className='text-4xl font-black' />
                            <span>{apartmentNumber}</span>
                        </span>
                        <span className='flex flex-row space-x-2 items-center'>
                            <MdEmail className='text-4xl font-black' />
                            <span>{postalCode}</span>
                        </span>
                        <span className='flex flex-row space-x-2 items-center'>
                            <FaPhone className='text-4xl font-black' />
                            <span>{phoneNumber}</span>
                        </span>
                        <span className='flex flex-row space-x-2 items-center'>
                            <FaInfoCircle className='text-4xl font-black' />
                            <span>{moreInfo}</span>
                        </span>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button className='text-lg font-black bg-slate-50 border border-slate-50 rounded-full text-slate-950 hover:bg-transparent hover:text-slate-50'>Back</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default OrderShippingInfo;
