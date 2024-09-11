import React, { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import supabase from '@/lib/supabase/supabaseClient'
import supabaseAdmin from '@/lib/supabase/supabaseAdmin'
import { IoPersonRemoveOutline } from "react-icons/io5";
import { Button } from '@/components/ui/button'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllUsersTable from './allUsersTable'

interface Data {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: string;
    status: string;
}

const BelowSection = ({ currentEmail }) => {
    const [areData, setAreData] = useState(false)
    const [adminUsers, setAdminUsers] = useState<Data[]>([])
    const [uuidAuth, setUuidAuth] = useState({})
    const [activeAccordion, setActiveAccordion] = useState('')

    useEffect(() => {
        fetchAdminUsers()
    }, [])

    const fetchAdminUsers = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "admin")

        if (error) {
            console.log(error)
        } else {
            if (!data || data.length === 0) {
                setAreData(false)
            } else {
                setAreData(true)
                setAdminUsers(data)

                const fetchAllAuthUserUuids = async () => {
                    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
                    if (authError) {
                        console.error(authError)
                    } else {
                        const uuidMap = {}
                        data.forEach((user) => {
                            const authUser = authData.users.find(authUser => authUser.email === user.email)
                            if (authUser) {
                                uuidMap[user.email] = authUser.id
                            }
                        })
                        setUuidAuth(uuidMap)
                    }
                }
                fetchAllAuthUserUuids()
            }
        }
    }

    const handleAccordionChange = (value) => {
        setActiveAccordion(value)
        if (value === "item-1") {
            fetchAdminUsers()
        }
    }

    const handleRemoveAdmin = async (email) => {
        const { data, error } = await supabase
            .from("profiles")
            .update({ role: "member" })
            .eq("email", email)

        if (error) {
            toast.error(`Error: ${error.message}`);
        } else {
            setAdminUsers(prevUsers => prevUsers.filter(user => user.email !== email))
            toast.success(`Successfully removed the admin user: ${email}`);
        }
    }

    return (
        <>
            <div className='mt-5'>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full m-2"
                    value={activeAccordion}
                    onValueChange={handleAccordionChange}
                >
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Admin</AccordionTrigger>
                        <AccordionContent>
                            {areData ? (
                                <div className="overflow-x-auto">
                                    <Table className="w-full min-w-max">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Surname</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Uuid - auth</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className='font-black'>
                                            {adminUsers.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>{user.name}</TableCell>
                                                    <TableCell>{user.surname}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>
                                                        <div className="overflow-auto">
                                                            {uuidAuth[user.email] || "---"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.email !== currentEmail && (
                                                            <Button 
                                                                onClick={() => handleRemoveAdmin(user.email)} 
                                                                className='cursor-pointer border border-red-600 bg-red-600 text-slate-50 hover:text-red-600 hover:bg-transparent'
                                                            >
                                                                <IoPersonRemoveOutline className='text-xl font-black'/>
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p>There are no admin users</p>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>All Users</AccordionTrigger>
                        <AccordionContent>
                            <AllUsersTable currentEmail={currentEmail}></AllUsersTable>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <ToastContainer />
            </div>
        </>
    )
}

export default BelowSection
