import React from 'react'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SignupSec2 = () => {
  return (
    <>
        <div className='grid grid-cols-2 gap-2'>
            <div>
            <Label htmlFor='city' className='text-sm'>
                City <span className='text-red-600 text-xs font-black'>*</span>
            </Label>
            <Input id='city' type='text' placeholder='City' />
            </div>
            <div>
            <Label htmlFor='shippingAddress' className='text-sm'>
                Shipping Address <span className='text-red-600 text-xs font-black'>*</span>
            </Label>
            <Input id='shippingAddress' type='text' placeholder='Shipping Address' />
            </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
            <div>
            <Label htmlFor='houseNumber' className='text-sm'>
                House Number <span className='text-red-600 text-xs font-black'>*</span>
            </Label>
            <Input id='houseNumber' type='text' placeholder='House Number' />
            </div>
            <div>
            <Label htmlFor='postalCode' className='text-sm'>
                Postal Code <span className='text-red-600 text-xs font-black'>*</span>
            </Label>
            <Input id='postalCode' type='number' placeholder='Postal Code' />
            </div>
        </div>

        <Label htmlFor='moreInfo' className='text-sm'>
            More Information for Delivery <span className='text-red-600 text-xs font-black'>*</span>
        </Label>
        <Input id='moreInfo' type='textarea' placeholder='+ More Information for Delivery' />
    </>
  )
}

export default SignupSec2