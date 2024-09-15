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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
            <DrawerContent className="bg-zinc-900 rounded-lg shadow-lg p-6 transition-transform transform duration-300 ease-in-out">
                <div className="mx-auto w-full max-w-md">
                    <DrawerHeader>
                        <DrawerTitle className="text-center text-2xl font-bold text-white">Shipping Info</DrawerTitle>
                        <DrawerDescription className="text-center text-sm text-gray-400">for {email}</DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col justify-center items-start text-left m-4 space-y-6">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex flex-row space-x-4 items-center cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition duration-200">
                                        <BiWorld className="text-3xl text-blue-400" />
                                        <span className="text-lg text-gray-100">{countryName}</span>
                                        <ReactCountryFlag countryCode={country} svg style={{ width: '2em', height: '2em' }} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-slate-50 bg-zinc-800 border border-gray-700 rounded-md p-2">
                                    <span className="font-semibold">Country</span>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex flex-row space-x-4 items-center cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition duration-200">
                                        <CgBorderTop className="text-3xl text-green-400" />
                                        <span className="text-lg text-gray-100">{stateName}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-slate-50 bg-zinc-800 border border-gray-700 rounded-md p-2">
                                    <span className="font-semibold">State</span>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex flex-row space-x-4 items-center cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition duration-200">
                                        <FaCity className="text-3xl text-purple-400" />
                                        <span className="text-lg text-gray-100">{city}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-slate-50 bg-zinc-800 border border-gray-700 rounded-md p-2">
                                    <span className="font-semibold">City</span>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex flex-row space-x-4 items-center cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition duration-200">
                                        <PiRoadHorizonFill className="text-3xl text-yellow-400" />
                                        <span className="text-lg text-gray-100">{address}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-slate-50 bg-zinc-800 border border-gray-700 rounded-md p-2">
                                    <span className="font-semibold">Address</span>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex flex-row space-x-4 items-center cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition duration-200">
                                        <TbNumber className="text-3xl text-pink-400" />
                                        <span className="text-lg text-gray-100">{houseNumber}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-slate-50 bg-zinc-800 border border-gray-700 rounded-md p-2">
                                    <span className="font-semibold">House Number</span>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex flex-row space-x-4 items-center cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition duration-200">
                                        <FaHouseFlag className="text-3xl text-red-400" />
                                        <span className="text-lg text-gray-100">{apartmentNumber}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-slate-50 bg-zinc-800 border border-gray-700 rounded-md p-2">
                                    <span className="font-semibold">Apartment Number</span>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex flex-row space-x-4 items-center cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition duration-200">
                                        <MdEmail className="text-3xl text-indigo-400" />
                                        <span className="text-lg text-gray-100">{postalCode}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-slate-50 bg-zinc-800 border border-gray-700 rounded-md p-2">
                                    <span className="font-semibold">Postal Code</span>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex flex-row space-x-4 items-center cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition duration-200">
                                        <FaPhone className="text-3xl text-teal-400" />
                                        <span className="text-lg text-gray-100">{phoneNumber}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-slate-50 bg-zinc-800 border border-gray-700 rounded-md p-2">
                                    <span className="font-semibold">Phone Number</span>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex flex-row space-x-4 items-center cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition duration-200">
                                        <FaInfoCircle className="text-3xl text-orange-400" />
                                        <span className="text-lg text-gray-100">{moreInfo}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="text-slate-50 bg-zinc-800 border border-gray-700 rounded-md p-2">
                                    <span className="font-semibold">More Info</span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <DrawerFooter className="flex justify-center mt-4">
                        <DrawerClose asChild>
                            <Button className="text-lg font-bold bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-500 transition-colors duration-300">Back</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default OrderShippingInfo;
