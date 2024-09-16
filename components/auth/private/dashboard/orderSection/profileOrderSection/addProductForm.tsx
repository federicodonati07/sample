import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@radix-ui/react-label';

const AddProductForm = ({open, onOpenChange}) => {
    

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-slate-950 text-slate-50 flex flex-col justify-center items-center">
                    <DialogHeader className="border-b border-slate-50 mb-6">
                        <DialogTitle className="text-slate-50 text-3xl font-bold">Add New Product</DialogTitle>
                        <DialogDescription className="text-slate-400 text-base mt-2">
                            Add new product.
                        </DialogDescription>
                    </DialogHeader>

                    <Card className="w-[350px] bg-gray-900 text-slate-50">
                        <CardHeader className='space-y-5'>
                            <div className='flex flex-row justify-center items-center border border-dashed border-slate-50 rounded-sm cursor-pointer w-full h-20'>
                                <span className='text-gray-600'>Import Product Image (.png only)</span>
                            </div>
                            <div className='border-b-2 border-slate-50 text-center'>
                                <Input type='text' placeholder='Product Name' className='border-none text-xl font-bold' ></Input>
                            </div>
                            <div className='border-b-2 border-slate-50 text-center'>
                                <Input type='textarea' placeholder='Product Description' className='border-none text-sm font-bold' ></Input>
                            </div>
                            <div className='flex flex-row justify-center items-center space-x-2'>
                                <div>
                                    <Select>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Product Validity" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-gray-900 text-slate-50'>
                                            <SelectGroup>
                                            <SelectLabel>Validity</SelectLabel>
                                                <SelectItem value="active">Active Product</SelectItem>
                                                <SelectItem value="suspended">Suspended Product</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Select>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Premium Product" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-gray-900 text-slate-50'>
                                            <SelectGroup>
                                            <SelectLabel>Validity</SelectLabel>
                                                <SelectItem value="active">Normal</SelectItem>
                                                <SelectItem value="veteran">Premium</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className='flex justify-center items-center text-center border-b-2 border-slate-50 w-[100px]'>
                                <Input type='number' placeholder='Price' className='border-none text-xl font-bold' ></Input>
                            </div>
                            <div>

                            </div>
                        </CardHeader>
                        <CardContent>
                            
                        </CardContent>
                        <CardFooter className="flex justify-between">
                        </CardFooter>
                        </Card>

                    <DialogFooter className="w-full flex justify-center mt-8">
                        <DialogTrigger className='grid grid-cols-2 gap-2'>
                            <Button className="text-lg font-bold bg-red-600 px-10 py-3 rounded-full text-white border border-red-600 hover:bg-transparent hover:text-red-600 hover:shadow-lg transition-all">
                                Back
                            </Button>
                            <Button className="text-lg font-bold bg-slate-50 px-10 py-3 rounded-full text-slate-950 border border-slate-50 hover:bg-transparent hover:text-slate-50 hover:shadow-lg transition-all">
                                Add New Order
                            </Button>
                        </DialogTrigger>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddProductForm