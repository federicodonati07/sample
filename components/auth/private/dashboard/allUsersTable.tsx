import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import supabaseAdmin from '@/lib/supabase/supabaseAdmin';
import { Input } from '@/components/ui/input';
import { ThreeDots } from 'react-loader-spinner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { FaCalendarAlt } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import supabase from '@/lib/supabase/supabaseClient';

const AllUsersTable = ({ currentEmail }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [profilesInfo, setProfilesInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const getAllUsers = async () => {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      if (data) {
        const users = data.users;
        setAllUsers(users);
        setFilteredUsers(users);

        const { data: profileData, error: profileError } = await supabase.from("profiles").select("*");
        if (profileError) {
          console.error(profileError.message);
        } else {
          const profileMap = profileData.reduce((acc, profile) => {
            acc[profile.email] = profile;
            return acc;
          }, {});
          setProfilesInfo(profileMap);
        }
      } else {
        console.error(error);
      }
      setIsLoading(false);
    };
    getAllUsers();
  }, []);

  const handleSearch = (search) => {
    const lowercasedSearch = search.toLowerCase();
    setFilteredUsers(allUsers.filter(user =>
      user.user_metadata?.full_name?.toLowerCase().includes(lowercasedSearch) ||
      user.email.toLowerCase().includes(lowercasedSearch) ||
      user.id.toLowerCase().includes(lowercasedSearch)
    ));
  };

  const handleSortByDate = (order) => {
    setFilteredUsers([...filteredUsers].sort((a, b) => order === 'desc' 
      ? new Date(b.created_at) - new Date(a.created_at) 
      : new Date(a.created_at) - new Date(b.created_at)));
  };

  const handleRoleChange = async (email, newRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('email', email);
    if (error) {
      toast.error("Error updating role: " + error.message);
    } else {
      toast.success("Role updated successfully!");
      setProfilesInfo((prevProfiles) => ({
        ...prevProfiles,
        [email]: { ...prevProfiles[email], role: newRole }
      }));
    }
  };

  const handleUnsubscribe = async (uuid, email) => {
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(uuid);
    if (authError) {
      toast.error("Error deleting user from auth: " + authError.message);
    } else {
      const { error: profileError } = await supabase.from("profiles").delete().eq("email", email);
      if (profileError) {
        toast.error("Error deleting user from profile: " + profileError.message);
      } else {
        toast.success(`User deleted successfully:\nprofile email: ${email}\nauth uuid: ${uuid}`);
        setFilteredUsers(filteredUsers.filter(user => user.id !== uuid));
        setAllUsers(allUsers.filter(user => user.id !== uuid));
      }
    }
  };

  const getProfileInfo = (email, key) => profilesInfo[email]?.[key] || '';

  const getRoleColorClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-teal-600 text-slate-50';
      case 'member':
        return 'bg-green-600 text-slate-50';
      case 'veteran':
        return 'bg-violet-600 text-slate-50';
      case 'banned':
        return 'bg-red-600 text-red-50';
      default:
        return '';
    }
  };

  const filterByRole = (role) => {
    setRoleFilter(role);
    if (role === 'all') {
      setFilteredUsers(allUsers);
    } else {
      setFilteredUsers(allUsers.filter(user => getProfileInfo(user.email, 'role') === role));
    }
  };

  return (
    <>
      <div className='flex flex-row space-x-2'>
        <Input
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
          placeholder='Search by name, surname, email, or UUID'
          className='w-52'
        />
        <Button onClick={() => handleSortByDate('desc')} className='bg-slate-50 text-slate-950'>
          Sort by Recent <FaCalendarAlt className='text-lg font-black' />
        </Button>
        <Button onClick={() => handleSortByDate('asc')} className='bg-slate-50 text-slate-950'>
          Sort by Oldest <FaCalendarAlt className='text-lg font-black' />
        </Button>
        <Select
          value={roleFilter}
          onValueChange={filterByRole}
          className='w-48'
        >
          <SelectTrigger className='w-52'>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              <SelectItem value="all" className='cursor-pointer'>All</SelectItem>
              <SelectItem value="admin" className={`cursor-pointer ${getRoleColorClass('admin')}`}>Admin</SelectItem>
              <SelectItem value="member" className={`cursor-pointer ${getRoleColorClass('member')}`}>Member</SelectItem>
              <SelectItem value="veteran" className={`cursor-pointer ${getRoleColorClass('veteran')}`}>Veteran</SelectItem>
              <SelectItem value="banned" className={`cursor-pointer ${getRoleColorClass('banned')}`}>Banned</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {isLoading && (
          <div>
            <ThreeDots
              visible={true}
              height="30"
              width="30"
              radius="5"
              color='#ffffff'
              ariaLabel
              ="three-dots-loading"
            />
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table className="overflow-auto w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name Surname</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Uuid - auth</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='font-black'>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.user_metadata?.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.email !== currentEmail ? (
                    <Select
                      value={getProfileInfo(user.email, 'role')}
                      onValueChange={(newRole) => handleRoleChange(user.email, newRole)}
                    >
                      <SelectTrigger className={`w-[180px] ${getRoleColorClass(getProfileInfo(user.email, 'role'))}`}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="admin" className={`cursor-pointer text-slate-50 ${getRoleColorClass('admin')}`}>Admin</SelectItem>
                          <SelectItem value="member" className={`cursor-pointer text-slate-50 ${getRoleColorClass('member')}`}>Member</SelectItem>
                          <SelectItem value="veteran" className={`cursor-pointer text-slate-50 ${getRoleColorClass('veteran')}`}>Veteran</SelectItem>
                          <SelectItem value="banned" className={`cursor-pointer text-slate-50 ${getRoleColorClass('banned')}`}>Banned</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={`flex flex-row border rounded-md p-1 left-0 ${getRoleColorClass(getProfileInfo(user.email, 'role'))}`}>
                      {getProfileInfo(user.email, 'role')}
                    </span>
                  )}
                </TableCell>
                <TableCell>{getProfileInfo(user.email, 'orders')}</TableCell>
                <TableCell>{format(new Date(user.created_at), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                    {user.email !== currentEmail && getProfileInfo(user.email, 'role') !== 'admin' ? (
                        <Button onClick={() => handleUnsubscribe(user.id, user.email)} className='bg-red-600 text-slate-50 hover:bg-transparent hover:text-red-600'>
                            Unsubscribe User
                        </Button>
                    ) : ("")}
                    
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ToastContainer />
    </>
  );
};

export default AllUsersTable;
