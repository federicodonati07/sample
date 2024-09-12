import supabase from '@/lib/supabase/supabaseClient';
import React, { useEffect, useState } from 'react';
import OrderShippingInfo from './orderSection/orderShippingInfo';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { FaBox, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import { IoPricetags } from "react-icons/io5";
import { MdAlternateEmail } from "react-icons/md";
import { Button } from '@/components/ui/button';
import { FiArchive } from "react-icons/fi";
import { RiArchiveStackLine } from "react-icons/ri";
import { HiMiniArchiveBoxXMark } from "react-icons/hi2"; // Import for the unarchive icon
import { ToastContainer, toast } from 'react-toastify';
import { CgRemoveR } from "react-icons/cg";
import { RiInboxArchiveLine } from "react-icons/ri";

interface Order {
    id: number;
    created_at: string;
    order_uuid: string;
    profile_uuid: string;
    profile_email: string;
    order_status: string;
    price: number;
    product_uuid: string;
    is_archived: boolean;
}

const orderStatusColors = {
    unread: 'bg-red-500 text-white',
    processing: 'bg-blue-500 text-white',
    shipped: 'bg-green-500 text-white',
    delivered: 'bg-violet-500 text-white',
    canceled: 'bg-red-500 text-white',
};

const TotalOrders = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [moreInfo, setMoreInfo] = useState('');

    const [sortKey, setSortKey] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('asc');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [showArchived, setShowArchived] = useState<boolean>(() => {
        // Read from localStorage or default to false
        const storedValue = localStorage.getItem('showArchived');
        return storedValue === 'true' || false;
    });

    const formatDateTime = (dateString: string) => {
        const date = parseISO(dateString);
        return format(date, "d MMMM yyyy - HH:mm", { locale: it });
    };

    const handleDrawer = async (uuid: string) => {
        setIsDrawerOpen(true);

        const { data } = await supabase
            .from('shipping_info')
            .select('*')
            .eq('profile_uuid', uuid)
            .single();

        if (data) {
            setCountry(data.country);
            setState(data.state);
            setCity(data.city);
            setAddress(data.address);
            setHouseNumber(data.house_number);
            setApartmentNumber(data.apartment_number);
            setPostalCode(data.postal_code);
            setPhoneNumber(data.phone_number);
            setMoreInfo(data.more_info);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsDrawerOpen(open);
    };

    useEffect(() => {
        const fetchAllOrders = async () => {
            const { data } = await supabase
                .from('orders')
                .select('*')
                .in("order_status", ['unread', 'processing', 'shipped', 'delivered', 'canceled'])

            if (data) {
                setOrders(data as Order[]);
            }
        };

        fetchAllOrders();
    }, []);

    useEffect(() => {
        if (dateFilter === 'newest') {
            setSortOrder('desc');
        } else {
            setSortOrder('asc');
        }
    }, [dateFilter]);

    useEffect(() => {
        // Save to localStorage whenever showArchived changes
        localStorage.setItem('showArchived', JSON.stringify(showArchived));
    }, [showArchived]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setSortKey('order_uuid'); // Default sortKey for UUID
    };

    const filteredOrders = orders
        .filter((order) =>
            (statusFilter ? order.order_status === statusFilter : true) &&
            (searchQuery ? 
                order.order_uuid.toLowerCase().includes(searchQuery) ||
                order.profile_email.toLowerCase().includes(searchQuery) 
                : true) &&
            (!order.is_archived || showArchived)  // Mostra archiviati solo se showArchived è true
        );

    const sortedAndFilteredOrders = filteredOrders
        .sort((a, b) => {
            if (sortKey === 'created_at') {
                const dateA = new Date(a[sortKey]);
                const dateB = new Date(b[sortKey]);

                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                    return 0;
                }

                return sortOrder === 'desc'
                    ? dateB.getTime() - dateA.getTime()
                    : dateA.getTime() - dateB.getTime();
            }

            const compare = String(a[sortKey]).localeCompare(String(b[sortKey]));
            return sortOrder === 'asc' ? compare : -compare;
        });

    const handleReadOrder = async (order_uuid: string) => {
        try {
            const { data, error } = await supabase
                .from("orders")
                .update({ order_status: "processing" })
                .eq("order_uuid", order_uuid);

            if (error) throw error;

            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.order_uuid === order_uuid ? { ...order, order_status: "processing" } : order
                )
            );

            toast.success(`Successfully updated the order status\nOrder UUID: ${order_uuid}`);
        } catch (error) {
            toast.error("Error: Unable to update order status");
        }
    };

    const handleArchiveOrder = async (order_uuid: string) => {
        try {
            const { data, error } = await supabase
                .from("orders")
                .update({ order_status: "archived" })
                .eq("order_uuid", order_uuid);

            if (error) throw error;

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.order_uuid === order_uuid ? { ...order, is_archived: true } : order
                )
            );

            toast.success(`Successfully archived the order\nOrder UUID: ${order_uuid}`);
        } catch (error) {
            toast.error("Error: Unable to archive the order");
        }
    };

    const handleUnarchiveOrder = async (order_uuid: string) => {
        try {
            const { data, error } = await supabase
                .from("orders")
                .update({ order_status: "processing" })
                .eq("order_uuid", order_uuid);

            if (error) throw error;

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.order_uuid === order_uuid ? { ...order, is_archived: false } : order
                )
            );

            toast.success(`Successfully unarchived the order\nOrder UUID: ${order_uuid}`);
        } catch (error) {
            toast.error("Error: Unable to unarchive the order");
        }
    };

    const handleCancelOrder = async (order_uuid: string) => {
        try {
            const { data, error } = await supabase
                .from("orders")
                .update({ order_status: "canceled" })
                .eq("order_uuid", order_uuid);

            if (error) throw error;

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.order_uuid === order_uuid ? { ...order, order_status: "canceled" } : order
                )
            );

            toast.success(`Successfully canceled the order\nOrder UUID: ${order_uuid}`);
        } catch (error) {
            toast.error("Error: Unable to cancel the order");
        }
    };

    return (
        <div className='flex flex-col justify-center items-center mt-5 px-4'>
            <div className='w-full max-w-6xl mb-4'>
                <div className='flex flex-col md:flex-row justify-between mb-4'>
                    <div className='flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2'>
                        <input
                            type='text'
                            placeholder='Search by UUID or Email'
                            className='p-2 border border-gray-600 rounded-lg bg-gray-800 text-white flex-1'
                            onChange={handleSearchChange}
                        />
                        <select
                            className='p-2 border border-gray-600 rounded-lg bg-gray-800 text-white flex-1 md:flex-none'
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value=''>All Statuses</option>
                            <option value='unread'>Unread</option>
                            <option value='processing'>Processing</option>
                            <option value='shipped'>Shipped</option>
                            <option value='delivered'>Delivered</option>
                            <option value='canceled'>Canceled</option>
                        </select>
                    </div>
                    <div className='flex space-x-2'>
                        <Button onClick={() => setDateFilter('newest')} variant='secondary'>Newest</Button>
                        <Button onClick={() => setDateFilter('oldest')} variant='secondary'>Oldest</Button>
                        <Button onClick={() => setShowArchived(!showArchived)} variant={showArchived ? 'default' : 'secondary'}>
                            {showArchived ? 'Hide Archived' : 'Show Archived'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className='w-full max-w-6xl'>
                {sortedAndFilteredOrders.map((order) => (
                    <div
                        key={order.id}
                        className={`flex flex-col border border-gray-700 rounded-xl bg-gray-800 text-white p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4 ${order.order_status == "archived" ? 'filter grayscale' : ''}`}
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                            <div className="flex items-center">
                                <FaBox className="text-3xl text-yellow-400 mr-3" />
                                <span className={`font-bold text-xl text-orange-500 ${order.order_status === "unread" ? "blur-sm disabled" : "blur-none"}`}>{order.order_uuid}</span>
                                <div className="ml-4">
                                    {order.order_status == "unread" ? (
                                        <div onClick={() => handleReadOrder(order.order_uuid)} className={`flex items-center space-x-2 p-2 cursor-pointer rounded-full ${orderStatusColors[order.order_status]} shadow-md`}>
                                            <span className="text-md font-black capitalize">{order.order_status}</span>
                                        </div>
                                    ) : (
                                        <div className={`flex items-center space-x-2 p-2 rounded-full ${orderStatusColors[order.order_status]} shadow-md`}>
                                            <span className="text-md font-black capitalize">{order.order_status}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <div className="flex flex-col">
                                    <div className="flex items-center mb-2">
                                        <MdAlternateEmail className="text-2xl text-teal-400 mr-2" />
                                        {order.order_status == "unread" ? (
                                            <div className="flex flex-row blur-sm">
                                                <span className="font-medium text-teal-400">{order.profile_email}</span>
                                                <FaExternalLinkAlt className="text-teal-400 ml-2" />
                                            </div>
                                        ) : (
                                            <div onClick={() => handleDrawer(order.profile_uuid)} className="flex flex-row cursor-pointer decoration-teal-400 hover:underline blur-none">
                                                <span className="font-medium text-teal-400">{order.profile_email}</span>
                                                <FaExternalLinkAlt className="text-teal-400 ml-2" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center mb-2">
                                    <FaCalendarAlt className="text-2xl text-blue-400 mr-2" />
                                    <span className={`font-medium ${order.order_status === "unread" ? "blur-sm disabled" : "blur-none"}`}>{formatDateTime(order.created_at)}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <IoPricetags className="text-2xl text-orange-400 mr-2" />
                                    <span className={`font-medium text-yellow-400 ${order.order_status === "unread" ? "blur-sm disabled" : "blur-none"}`}>{order.price.toFixed(2)} €</span>
                                </div>
                                {order.order_status == "unread" ? "" : (
                                    <>
                                        {order.order_status == "archived" ? (
                                            <div className="flex items-center mb-2">
                                                <HiMiniArchiveBoxXMark className="text-2xl text-gray-600 mr-2" />
                                                <span onClick={() => handleUnarchiveOrder(order.order_uuid)} className="font-medium cursor-pointer hover:underline text-gray-400">Unarchive Order</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center mb-2">
                                                <RiInboxArchiveLine className="text-2xl text-gray-600 mr-2" />
                                                <span onClick={() => handleArchiveOrder(order.order_uuid)} className="font-medium cursor-pointer hover:underline text-gray-400">Archive Order</span>
                                            </div>
                                        )}

                                        <div className="flex items-center mb-2">
                                            <CgRemoveR className="text-2xl text-red-600 mr-2" />
                                            <span onClick={() => handleCancelOrder(order.order_uuid)} className="font-medium cursor-pointer hover:underline text-red-400">Cancel Order</span>
                                        </div>
                                    </>
                                )}
                                
                            </div>
                        </div>
                        <OrderShippingInfo
                            open={isDrawerOpen}
                            onOpenChange={handleOpenChange}
                            email={order.profile_email}
                            country={country}
                            state={state}
                            city={city}
                            address={address}
                            houseNumber={houseNumber}
                            apartmentNumber={apartmentNumber}
                            postalCode={postalCode}
                            phoneNumber={phoneNumber}
                            moreInfo={moreInfo} 
                        />
                    </div>
                    
                ))}
            </div>
        </div>
    );
};

export default TotalOrders;
