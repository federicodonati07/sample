import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '@radix-ui/react-label';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import SignupSec1 from './signupSections/signupSec1';

const Signup = () => {
    const router = useRouter();
  const [isSection, setIsSection] = useState('signup');
  
  const toggleSection = () => {
    if (isSection === 'signup') {
      setIsSection('shipping');
    } else {
      setIsSection('signup');
    }
  };

  return (
    <>
      <div className='m-1 w-full'>
        {isSection === 'signup' ? (
          <>
            <SignupSec1></SignupSec1>
          </>
        ) : isSection === 'shipping' ? (
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
        ) : (
          ''
        )}

        <div className='flex flex-row justify-center items-center mt-2'>
          {isSection === 'signup' ? (
            <>
              <Button className='bg-slate-50 text-slate-950 mt-2 font-black'>
                <FcGoogle className='m-1' />
                Signup with Google
              </Button>
              <span className='m-2 my-3'>or</span>
              <Button onClick={toggleSection} className='bg-slate-50 text-slate-950 mt-2 font-black'>
                Next 1 of 2
              </Button>
            </>
          ) : isSection === 'shipping' ? (
            <>
              <Button onClick={toggleSection} className='bg-slate-50 text-slate-950 mt-2 font-black'>
                Back 1 of 2
              </Button>
              <span className='m-2 my-3'>or</span>
              <Button className='bg-slate-50 text-slate-950 mt-2 font-black'>Signup</Button>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  );
};

export default Signup;
