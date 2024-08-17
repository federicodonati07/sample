import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SignupSec1 = () => {
  const [email, setEmail] = useState('');
  const [checkEmail, setCheckEmail] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState(false);
  const [checkConfirmPassword, setCheckConfirmPassword] = useState(false);

  // Handle Email Change
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setCheckEmail(regex.test(value) && value !== '');
  };

  // Handle Password Change
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
    setCheckPassword(regex.test(value));
    // Update confirmPassword check based on new password
    if (confirmPassword === '') {
      setCheckConfirmPassword(false); // Confirm password is invalid if empty
    } else {
      setCheckConfirmPassword(value === confirmPassword);
    }
  };

  // Handle Confirm Password Change
  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    // Confirm password is invalid if it doesn't match the password or if it's empty
    setCheckConfirmPassword(value === password && value !== '');
  };

  return (
    <>
      <div className='flex flex-col justify-center items-center text-center'>
        <Label htmlFor='email' className={`text-sm ${checkEmail ? 'text-green-600' : 'text-slate-50'}`}>
          Email <span className='text-red-600 text-xs font-black'>*</span>
        </Label>
        <Input
          id='email'
          onChange={handleChangeEmail}
          value={email}
          type='email'
          placeholder='ex. mail@gmail.com'
          className={`border ${checkEmail ? 'border-green-600' : 'border-slate-50'}`}
        />

        <div className='grid grid-cols-2 gap-2'>
          <div>
            <Label htmlFor='password' className={`text-sm ${checkPassword ? 'text-green-600' : 'text-slate-50'}`}>
              Password <span className='text-red-600 text-xs font-black'>*</span>
            </Label>
            <Input
              id='password'
              type='password'
              placeholder='Password'
              onChange={handleChangePassword}
              value={password}
              className={`border ${checkPassword ? 'border-green-600' : 'border-slate-50'}`}
            />
          </div>
          <div>
            <Label htmlFor='confirmPassword' className={`text-sm ${checkConfirmPassword ? 'text-green-600' : 'text-slate-50'}`}>
              Confirm Password <span className='text-red-600 text-xs font-black'>*</span>
            </Label>
            <Input
              id='confirmPassword'
              type='password'
              placeholder='Confirm Password'
              onChange={handleChangeConfirmPassword}
              value={confirmPassword}
              className={`border ${checkConfirmPassword ? 'border-green-600' : 'border-slate-50'}`}
            />
          </div>
        </div>
        <div className={`mt-1 ${checkPassword ? 'hidden' : 'block'}`}>
          <span className='text-sm text-red-600 font-black'>(8-16, abc, ABC, 123, !$#)</span>
        </div>
      </div>
    </>
  );
};

export default SignupSec1;
