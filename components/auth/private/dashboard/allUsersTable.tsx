'use client';
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

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    full_name: string;
  };
}

interface Profile {
  email: string;
  role: string;
  orders: number;
}

interface AllUsersTableProps {
  currentEmail: string;
}

const AllUsersTable: React.FC<AllUsersTableProps> = ({ currentEmail }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [profilesInfo, setProfilesInfo] = useState<Record<string, Profile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    const getAllUsers = async () => {
      setIsLoading(true);
      try {
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
        if (userError) throw userError;
        const users: User[] = userData.users.map((user: any) => ({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          user_metadata: {
            full_name: user.user_metadata?.full_name || 'Unknown',
          },
        }));

        const { data: profileData, error: profileError } = await supabase.from('profiles').select('*');
        if (profileError) throw profileError;

        const profileMap: Record<string, Profile> = profileData.reduce((acc, profile) => {
          acc[profile.email] = profile;
          return acc;
        }, {});

        setAllUsers(users);
        setFilteredUsers(users);
        setProfilesInfo(profileMap);
      } catch (error: any) {
        console.error('Error fetching users:', error.message);
        toast.error(`Error fetching users: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    getAllUsers();
  }, []);

  const handleSearch = (search: string) => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = allUsers.filter((user) =>
      user.user_metadata.full_name.toLowerCase().includes(lowercasedSearch) ||
      user.email.toLowerCase().includes(lowercasedSearch) ||
      user.id.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredUsers(filtered);
  };

  const handleSortByDate = (order: 'asc' | 'desc') => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredUsers(sortedUsers);
  };

  const handleRoleChange = async (email: string, newRole: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('email', email);
      if (error) throw error;
      toast.success('Role updated successfully!');
      setProfilesInfo((prevProfiles) => ({
        ...prevProfiles,
        [email]: { ...prevProfiles[email], role: newRole },
      }));
    } catch (error: any) {
      console.error('Error updating role:', error.message);
      toast.error(`Error updating role: ${error.message}`);
    }
  };

  const handleUnsubscribe = async (uuid: string, email: string) => {
    try {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(uuid);
      if (authError) throw authError;

      const { error: profileError } = await supabase.from('profiles').delete().eq('email', email);
      if (profileError) throw profileError;

      toast.success(`User ${email} unsubscribed successfully.`);
      setAllUsers((prevUsers) => prevUsers.filter((user) => user.id !== uuid));
      setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== uuid));
      setProfilesInfo((prevProfiles) => {
        const updatedProfiles = { ...prevProfiles };
        delete updatedProfiles[email];
        return updatedProfiles;
      });

      const { data, error } = await supabase
        .from("shipping_info")
        .delete()
        .eq('profile_uuid', uuid);

      if (error) {
        console.error('Error deleting shipping info:', error.message);
      }

    } catch (error: any) {
      console.error('Error unsubscribing user:', error.message);
      toast.error(`Error unsubscribing user: ${error.message}`);
    }
  };

  const getProfileInfo = (email: string, key: keyof Profile): string | number => {
    return profilesInfo[email]?.[key] ?? (key === 'orders' ? 0 : 'Not Assigned');
  };

  const getRoleColorClass = (role: string): string => {
    const roleClasses: Record<string, string> = {
      admin: 'bg-teal-600 text-slate-50',
      member: 'bg-green-600 text-slate-50',
      veteran: 'bg-violet-600 text-slate-50',
      banned: 'bg-red-600 text-slate-50',
    };
    return roleClasses[role] || 'bg-gray-600 text-slate-50';
  };

  const filterByRole = (role: string) => {
    setRoleFilter(role);
    if (role === 'all') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) => getProfileInfo(user.email, 'role') === role);
      setFilteredUsers(filtered);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
        <Input
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name, email, or UUID"
          className="flex-1 md:w-64"
        />
        <div className="flex gap-2">
          <Button
            onClick={() => handleSortByDate('desc')}
            className="flex items-center gap-2 bg-slate-50 text-slate-900 hover:bg-slate-200 rounded-lg"
          >
            Sort by Recent <FaCalendarAlt />
          </Button>
          <Button
            onClick={() => handleSortByDate('asc')}
            className="flex items-center gap-2 bg-slate-50 text-slate-900 hover:bg-slate-200 rounded-lg"
          >
            Sort by Oldest <FaCalendarAlt />
          </Button>
        </div>
        <Select value={roleFilter} onValueChange={filterByRole}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="veteran">Veteran</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {isLoading && (
          <div className="flex justify-center items-center w-full">
            <ThreeDots
              visible={true}
              height="30"
              width="30"
              radius="5"
              color='#ffffff'
              ariaLabel="three-dots-loading"
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-gray-900 p-4 rounded-lg shadow-lg">
        <Table className="min-w-full bg-gray-800 text-white">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>UUID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.user_metadata.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.email !== currentEmail ? (
                    <Select
                      value={getProfileInfo(user.email, 'role') as string}
                      onValueChange={(newRole) => handleRoleChange(user.email, newRole)}
                    >
                      <SelectTrigger className={`w-full ${getRoleColorClass(getProfileInfo(user.email, 'role') as string)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="veteran">Veteran</SelectItem>
                          <SelectItem value="banned">Banned</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={`px-2 py-1 rounded ${getRoleColorClass(getProfileInfo(user.email, 'role') as string)}`}>
                      {getProfileInfo(user.email, 'role')}
                    </span>
                  )}
                </TableCell>
                <TableCell>{getProfileInfo(user.email, 'orders')}</TableCell>
                <TableCell>{format(new Date(user.created_at), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  {user.email !== currentEmail && getProfileInfo(user.email, 'role') !== 'admin' && (
                    <Button
                      onClick={() => handleUnsubscribe(user.id, user.email)}
                      className="bg-red-600 text-white hover:bg-red-700 rounded-lg"
                    >
                      Unsubscribe
                    </Button>
                  )}
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

