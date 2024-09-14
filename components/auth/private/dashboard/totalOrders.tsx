import supabase from '@/lib/supabase/supabaseClient';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import { FaSearch, FaFilter, FaArchive } from 'react-icons/fa';
import { HiMiniArchiveBoxXMark } from "react-icons/hi2";

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
    archived: 'bg-gray-600 text-white',
};

const TotalOrders = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [archivedOrders, setArchivedOrders] = useState<Order[]>([]);
    const [sortKey, setSortKey] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('asc');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [showArchived, setShowArchived] = useState<boolean>(() => {
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
            // Set shipping details here
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsDrawerOpen(open);
    };

    const fetchOrders = async () => {
        const { data: activeOrders } = await supabase
            .from('orders')
            .select('*')
            .in("order_status", ['unread', 'processing', 'shipped', 'delivered', 'canceled']);
        const { data: archivedOrders } = await supabase
            .from('orders')
            .select('*')
            .eq("order_status", 'archived');

        if (activeOrders) setOrders(activeOrders as Order[]);
        if (archivedOrders) setArchivedOrders(archivedOrders as Order[]);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        setSortOrder(dateFilter === 'newest' ? 'desc' : 'asc');
    }, [dateFilter]);

    useEffect(() => {
        localStorage.setItem('showArchived', JSON.stringify(showArchived));
    }, [showArchived]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.toLowerCase());
        setSortKey('order_uuid');
    };

    const filteredOrders = orders.filter(order =>
        (statusFilter ? order.order_status === statusFilter : true) &&
        (searchQuery ?
            order.order_uuid.toLowerCase().includes(searchQuery) ||
            order.profile_email.toLowerCase().includes(searchQuery)
            : true)
    );

    const filteredArchivedOrders = archivedOrders.filter(order =>
        (searchQuery ?
            order.order_uuid.toLowerCase().includes(searchQuery) ||
            order.profile_email.toLowerCase().includes(searchQuery)
            : true)
    );

    const sortedOrders = filteredOrders.sort((a, b) => {
        if (sortKey === 'created_at') {
            const dateA = new Date(a[sortKey]);
            const dateB = new Date(b[sortKey]);
            return sortOrder === 'desc'
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
        }
        return sortOrder === 'asc'
            ? String(a[sortKey]).localeCompare(String(b[sortKey]))
            : String(b[sortKey]).localeCompare(String(a[sortKey]));
    });

    const sortedArchivedOrders = filteredArchivedOrders.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'desc'
            ? dateB.getTime() - dateA.getTime()
            : dateA.getTime() - dateB.getTime();
    });

    const handleArchiveOrder = async (order_uuid: string) => {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ order_status: "archived" })
                .eq("order_uuid", order_uuid);

            if (error) throw error;
            fetchOrders();
            toast.success(`Order archived: ${order_uuid}`);
        } catch (error) {
            toast.error("Error archiving order");
        }
    };

    const handleUnarchiveOrder = async (order_uuid: string) => {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ order_status: "delivered" })
                .eq("order_uuid", order_uuid);

            if (error) throw error;
            fetchOrders();
            toast.success(`Order unarchived: ${order_uuid}`);
        } catch (error) {
            toast.error("Error unarchiving order");
        }
    };

    return (
        <div className='flex flex-col justify-center items-center mt-5 px-4'>
            <div className='w-full max-w-6xl mb-4'>
                <div className='flex flex-col md:flex-row items-start mb-4'>
                    <input
                        type='text'
                        placeholder='Search by UUID or Email'
                        className='p-2 border border-gray-600 rounded-lg bg-gray-800 text-white'
                        onChange={handleSearchChange}
                    />
                    <select
                        className='p-2 border border-gray-600 rounded-lg bg-gray-800 text-white ml-2'
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value=''>All Statuses</option>
                        <option value='unread'>Unread</option>
                        <option value='processing'>Processing</option>
                        <option value='shipped'>Shipped</option>
                        <option value='delivered'>Delivered</option>
                        <option value='canceled'>Canceled</option>
                    </select>
                    <div className='flex space-x-2 ml-2'>
                        <Button onClick={() => setDateFilter('newest')} variant='secondary'>
                            <FaSearch className='mr-1' /> Newest
                        </Button>
                        <Button onClick={() => setDateFilter('oldest')} variant='secondary'>
                            <FaSearch className='mr-1' /> Oldest
                        </Button>
                        <Button onClick={() => setShowArchived(!showArchived)} variant={showArchived ? 'default' : 'secondary'}>
                            {showArchived ? 'Show Active' : 'Show Archived'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className='w-full max-w-6xl'>
                {showArchived ? (
                    sortedArchivedOrders.map((order) => (
                        <OrderCard key={order.id} order={order} onUnarchive={handleUnarchiveOrder} fetchOrders={fetchOrders} />
                    ))
                ) : (
                    sortedOrders.map((order) => (
                        <OrderCard key={order.id} order={order} onArchive={handleArchiveOrder} fetchOrders={fetchOrders} />
                    ))
                )}
            </div>

            <ToastContainer />
        </div>
    );
};


import React from 'react';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

const OrderCard = ({ order, onArchive, onUnarchive, fetchOrders }: { order: Order, onArchive?: (uuid: string) => void, onUnarchive?: (uuid: string) => void, fetchOrders: () => Promise<void> }) => {
    const formatDateTime = (dateString: string) => {
        const date = parseISO(dateString);
        return format(date, "d MMMM yyyy - HH:mm", { locale: it });
    };

    const updateOrderStatus = async (newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ order_status: newStatus })
                .eq('order_uuid', order.order_uuid);

            if (error) throw error;
            toast.success(`Order status updated to ${newStatus}`);
            await fetchOrders(); // Refresh orders to update the UI
        } catch (error) {
            toast.error("Error updating order status");
        }
    };

    const handleNextState = () => {
        const nextState = order.order_status === 'processing' ? 'shipped' :
                          order.order_status === 'shipped' ? 'delivered' : 'delivered';
        updateOrderStatus(nextState);
    };

    const handlePrevState = () => {
        const prevState = order.order_status === 'delivered' ? 'shipped' :
                          order.order_status === 'shipped' ? 'processing' : 'processing';
        updateOrderStatus(prevState);
    };

    const handleCancelOrder = () => {
        updateOrderStatus('canceled');
    };

    const handleOrderClick = async () => {
        if (order.order_status === 'unread') {
            updateOrderStatus('processing');
        }
    };

    return (
        <div className={`relative bg-gray-700 rounded-lg p-4 w-full h-full shadow-lg mb-4 overflow-auto ${order.order_status === "archived" ? "grayscale" : ""}`}>
            {/* Overlay for unread orders */}
            {order.order_status === 'unread' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="transition-all ease-in duration-300 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer z-10 hover:opacity-25"
                        onClick={handleOrderClick}>
                        <span className="text-white text-lg font-bold">
                            Click to Read
                        </span>
                    </div>
                    <div className="absolute inset-0 blur-sm"></div>
                </div>
            )}
            <div className={`relative ${order.order_status === 'unread' ? 'blur-sm' : ''}`}>
                <div className='flex justify-between'>
                    <div className='text-lg text-white'>
                        Order UUID: <span className='text-violet-400'>{order.order_uuid}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full ${orderStatusColors[order.order_status]}`}>
                        {order.order_status}
                    </div>
                </div>
                <div className='flex flex-rows justify-between mt-2 mb-2'>
                    <div>
                        <div className='text-sm text-gray-400'>
                            {formatDateTime(order.created_at)}
                        </div>
                        <div className='text-sm text-gray-400 cursor-pointer'>
                            <span className='text-teal-400'>{order.profile_email}</span>
                        </div>
                    </div>
                    
                    <div className='text-slate-50 text-xl font-bold ml-5'>
                        {order.price} €
                    </div>
                </div>
                
                

                {/* Next/Prev State and Cancel buttons */}
                

                

                <div className='flex justify-center'>
                    {order.order_status === 'archived' ? (
                        <Button onClick={() => onUnarchive?.(order.order_uuid)} className='text-slate-950 bg-white font-bold border border-slate-50 rounded-lg hover:bg-transparent hover:text-slate-50'>
                            <HiMiniArchiveBoxXMark className='inline mr-2' /> Unarchive
                        </Button>
                    ) : (
                        <>
                            <div className='flex flex-row space-x-10 mt-2'>
                                <div className={`flex justify-center items-center ${order.order_status === "canceled" ? "hidden" : ""}`}>
                                    <Button onClick={handleCancelOrder} className='text-slate-50 bg-red-600 font-bold border border-red-600 rounded-lg hover:bg-transparent hover:text-slate-50'>
                                        <FaTimes className='inline mr-2' />Cancel Order
                                    </Button>
                                </div>
                                <div className={`flex justify-center items-center space-x-2 ${order.order_status === "canceled" ? "hidden" : ""}`}>
                                    <Button onClick={handlePrevState} disabled={order.order_status === 'processing'} className='text-slate-950 bg-white font-bold border border-slate-50 rounded-lg hover:bg-transparent hover:text-slate-50'>
                                        <FaArrowLeft/>
                                    </Button>
                                    {order.order_status === "delivered" ? (
                                        <></>
                                    ):(
                                       <Button onClick={handleNextState} disabled={order.order_status === 'delivered'} className='text-slate-950 bg-white font-bold border border-slate-50 rounded-lg hover:bg-transparent hover:text-slate-50'>
                                            <FaArrowRight/>
                                        </Button> 
                                    )}
                                    {order.order_status === "delivered" ? (
                                        <div className='flex justify-end items-end'>
                                            <Button onClick={() => onArchive?.(order.order_uuid)} className='text-slate-950 bg-white font-bold border border-slate-50 rounded-lg hover:bg-transparent hover:text-slate-50'>
                                                <FaArchive className='inline mr-2' />Archive
                                            </Button>
                                        </div>
                                    ):(
                                        <></>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TotalOrders;
