import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import supabase from '@/lib/supabase/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserInfo = ({ name, surname, email, role, orders, uuid }) => {
  const [inputNameValue, setInputNameValue] = useState(name || '');
  const [inputSurnameValue, setInputSurnameValue] = useState(surname || '');
  const [cancelledCount, setCancelledCount] = useState("0");
  const [archivedCount, setArchivedCount] = useState("0");

  const handleEdit = async () => {
    if (inputNameValue !== '' || inputSurnameValue !== '') {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email);

        if (error) {
          throw error; // throw error to be caught in the catch block
        }

        if (data?.length === 0) {
          const { data, error } = await supabase
            .from('profiles')
            .insert([{
              name: inputNameValue,
              surname: inputSurnameValue,
              email: email,
            }]);

          if (error) {
            throw error;
          }
        } else {
          const { data, error } = await supabase
            .from('profiles')
            .update({
              name: inputNameValue,
              surname: inputSurnameValue,
            })
            .eq('email', email)
            .single();

          if (error) {
            throw error;
          } else {
            toast.success("User info edited successfully");
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    }
  };

  useEffect(() => {
    const fetchOrderCounts = async () => {
      const cancelledPromise = supabase
        .from("orders")
        .select("*")
        .eq("profile_uuid", uuid)
        .in('order_status', ['cancelled']);

      const archivedPromise = supabase
        .from("orders")
        .select("*")
        .eq("profile_uuid", uuid)
        .in('order_status', ['archived']);

      try {
        const [cancelledResult, archivedResult] = await Promise.all([cancelledPromise, archivedPromise]);

        console.log(cancelledResult, archivedResult)

        const cancelledCount = cancelledResult.data?.length || 0;
        const archivedCount = archivedResult.data?.length || 0;

        setCancelledCount(cancelledCount.toString());
        setArchivedCount(archivedCount.toString());
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };

    fetchOrderCounts();
    setInputNameValue(name || '');
    setInputSurnameValue(surname || '');
  }, [name, surname, uuid]);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 shadow-lg rounded-lg border border-gray-900 mt-4">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-300 mb-2">Name</label>
            <Input
              type="text"
              value={inputNameValue}
              onChange={(e) => setInputNameValue(e.target.value)}
              placeholder="Enter name"
              className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-300 mb-2">Surname</label>
            <Input
              type="text"
              value={inputSurnameValue}
              onChange={(e) => setInputSurnameValue(e.target.value)}
              placeholder="Enter surname"
              className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
            />
          </div>
        </div>
        <div className="flex justify-center mb-6">
          <Button onClick={handleEdit} className="bg-white text-slate-950 border border-slate-50 hover:bg-transparent hover:text-slate-50 font-bold rounded-lg py-2 px-4">
            Edit User Info
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-lg font-medium text-gray-300">Email:</span> <span className="text-gray-400">{email}</span>
          </div>
          <div>
            <span className="text-lg font-medium text-gray-300">Role:</span> <span className={`font-semibold ${role === 'admin' ? 'text-teal-400' : role === 'veteran' ? 'text-violet-400' : role === 'member' ? 'text-green-400' : role === 'banned' ? 'text-red-400' : 'text-gray-400'}`}>{role}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`transition-all ease-in duration-200 flex items-center justify-between opacity-75 p-4 border border-yellow-400 text-yellow-200 bg-yellow-600 hover:bg-yellow-700 hover:opacity-100 rounded-lg ${parseInt(orders) == 0 ? "cursor-default" : "cursor-pointer"}`}>
              <span className="text-lg font-medium">Pending Orders:</span>
              <span className="font-bold text-2xl px-4 py-2">{orders}</span>
            </div>
            <div className={`transition-all ease-in duration-200 flex items-center justify-between opacity-75 p-4 border border-red-400 text-red-200 bg-red-600 hover:bg-red-700 hover:opacity-100 rounded-lg ${parseInt(cancelledCount) == 0 ? "cursor-default" : "cursor-pointer"}`}>
              <span className="text-xl font-medium">Cancelled Orders:</span>
              <span className="font-bold text-2xl px-4 py-2">{cancelledCount}</span>
            </div>
            <div className={`transition-all ease-in duration-200 flex items-center justify-between opacity-75 p-4 border border-gray-400 text-gray-200 bg-gray-600 hover:bg-gray-700 hover:opacity-100 rounded-lg ${parseInt(archivedCount) == 0 ? "cursor-default" : "cursor-pointer"}`}>
              <span className="text-lg font-medium text-gray-300">Archived Orders:</span>
              <span className="font-bold text-2xl px-4 py-2">{archivedCount}</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UserInfo;
