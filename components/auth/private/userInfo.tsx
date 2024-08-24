import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import supabase from '@/lib/supabase/supabaseClient';

const UserInfo = ({ name, surname, email, role, orders }) => {
  const [inputNameValue, setInputNameValue] = useState(name || '');
  const [inputSurnameValue, setInputSurnameValue] = useState(surname || '');

  const handleEdit = async () => {
    if (inputNameValue !== '' || inputSurnameValue !== '') {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);

      if (error) {
        window.location.href = '/private';
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
          window.location.href = '/private';
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
          window.location.href = '/private';
        }
      }
    }
  };

  useEffect(() => {
    setInputNameValue(name || '');
    setInputSurnameValue(surname || '');
  }, [name, surname]);

  return (
    <div className="lg:border lg:border-gray-300 lg:rounded-lg p-4 lg:max-w-3xl lg:mx-auto mt-2 shadow-lg">
      <div className="text-center mb-4">
        <span className="text-2xl font-bold">User Information</span>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1">Name:</label>
            <Input
              type="text"
              value={inputNameValue}
              onChange={(e) => setInputNameValue(e.target.value)}
              placeholder="Insert a value"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1">Surname:</label>
            <Input
              type="text"
              value={inputSurnameValue}
              onChange={(e) => setInputSurnameValue(e.target.value)}
              placeholder="Insert a value"
              className="p-2"
            />
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <Button onClick={handleEdit} className="bg-slate-50 text-slate-950">
            Edit User Info
          </Button>
        </div>
        <div className="space-y-2">
          <div>
            <span className="text-lg font-semibold">Email:</span> <span className="font-semibold text-gray-500">{email}</span>
          </div>
          <div>
            <span className="text-lg font-semibold">Role:</span> <span className={`font-semibold text-gray-500 ${role === 'admin' ? 'text-teal-600' : role === 'veteran' ? 'text-violet-600' : role === 'member' ? 'text-green-600' : role === 'banned' ? 'text-red-600' : ''}`}>{role}</span>
          </div>
          <div>
            <span className="text-lg font-semibold">Orders:</span> <span className="font-semibold text-gray-500">{orders}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
