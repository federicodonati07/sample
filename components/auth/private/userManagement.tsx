import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FaShippingFast } from 'react-icons/fa';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import supabase from '@/lib/supabase/supabaseClient';
import SignupSec2 from '../signupSections/signupSec2';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isValidNumber, parsePhoneNumber } from 'libphonenumber-js';
import { useRouter } from 'next/navigation';

const UserManagement = ({ uuid, email }) => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [moreInfo, setMoreInfo] = useState('');
  const [apartamentNumber, setApartamentNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);
  const [isShipping, setIsShipping] = useState(false); // If false, data found; if true, data not found

  const router = useRouter();

  useEffect(() => {
    const fetchShippingInfo = async () => {
      const { data, error } = await supabase
        .from('shipping_info')
        .select('*')
        .eq('profile_uuid', uuid)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found
          setIsShipping(true);
        } else {
          // Other error
          console.error('Error fetching data:', error.message);
        }
        return;
      }

      // If data is found, no need to add shipping information
      setIsShipping(!data);
    };

    fetchShippingInfo();
  }, [uuid]);

  const validateInputs = () => {
    try {
      const phone = parsePhoneNumber(phoneNumber);
      if (!phone || !isValidNumber(phone.number)) {
        throw new Error('Invalid phone number');
      }
    } catch {
      setError('Invalid phone number');
      setIsError(true);
      return false;
    }

    if (![name, surname, selectedCountry, selectedState, selectedCity, shippingAddress, postalCode, houseNumber, apartamentNumber, phoneNumber].every(Boolean)) {
      setError('Please fill out all fields');
      setIsError(true);
      return false;
    }

    setError('');
    setIsError(false);
    return true;
  };

  const handleShipping = async () => {
    if (validateInputs()) {
      try {
        if (isShipping) {  // Data not found
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

          if (profileError) {
            setError(`Error: ${profileError.message}`);
            setIsError(true);
            return;
          }

          if (profileData) {
            const { error: shippingError } = await supabase
              .from('shipping_info')
              .insert([{
                profile_uuid: uuid, 
                country: selectedCountry,
                state: selectedState,
                city: selectedCity,
                address: shippingAddress,
                house_number: houseNumber,
                apartament_number: apartamentNumber, // Ensure this is the correct column name
                postal_code: postalCode,
                phone_number: phoneNumber,
                more_info: moreInfo
              }]);

            if (shippingError) {
              setError(`Error: ${shippingError.message}`);
              setIsError(true);
            } else {
              router.refresh()
            }
          } else {
            // Insert profile if it does not exist
            const { error: insertProfileError } = await supabase
              .from('profiles')
              .insert([{
                name: name, 
                surname: surname,
                email: email,
                role: 'member',
                orders: 0
              }]);

            if (insertProfileError) {
              setError(`Error: ${insertProfileError.message}`);
              setIsError(true);
              return;
            }

            // After inserting the profile, insert shipping information
            const { error: insertShippingError } = await supabase
              .from('shipping_info')
              .insert([{
                profile_uuid: uuid, 
                country: selectedCountry,
                state: selectedState,
                city: selectedCity,
                address: shippingAddress,
                house_number: houseNumber,
                apartament_number: apartamentNumber, // Ensure this is the correct column name
                postal_code: postalCode,
                phone_number: phoneNumber,
                more_info: moreInfo
              }]);

            if (insertShippingError) {
              setError(`Error: ${insertShippingError.message}`);
              setIsError(true);
            } else {
              router.refresh()
            }
          }
        } else {  
            const { data, error } = await supabase
                .from('shipping_info')
                .update([{
                    country: selectedCountry, 
                    state: selectedState,
                    city: selectedCity,
                    address: shippingAddress,
                    house_number: houseNumber,
                    apartament_number: apartamentNumber, // Ensure this is the correct column name
                    postal_code: postalCode,
                    phone_number: phoneNumber,
                    more_info: moreInfo
                }])
                .eq('profile_uuid', uuid);

            if (error) {
                setError('Error updating shipping information');
                setIsError(true);
            }else{
              router.refresh()
            }
        }
      } catch (err) {
        console.error('Error during data insertion:', err);
        setError('Error during data insertion');
        setIsError(true);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center text-center">
        <h2 className="font-black mb-2">User Management</h2>
        <div className="overflow-auto justify-center items-center grid grid-rows-2 md:grid-cols-2 mt-5 gap-2">
          <AlertDialog>
            <AlertDialogTrigger>
              {isShipping ? (
                <Button className="bg-blue-600">
                <FaShippingFast className="text-xl font-black" />
                  Add shipping information
                </Button>
              ) : ""}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-950">
              <AlertDialogHeader>
                <AlertDialogTitle>{isShipping ? 'Add Shipping Info' : 'Edit Shipping Info'}</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-50 font-black">
                  <Alert variant="destructive" className={`${isError ? 'block' : 'hidden'}`}>
                    <ExclamationTriangleIcon />
                    <AlertTitle>Error:</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                  <SignupSec2
                    shippingAddress={shippingAddress}
                    setShippingAddress={setShippingAddress}
                    houseNumber={houseNumber}
                    setHouseNumber={setHouseNumber}
                    postalCode={postalCode}
                    setPostalCode={setPostalCode}
                    moreInfo={moreInfo}
                    setMoreInfo={setMoreInfo}
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    apartamentNumber={apartamentNumber}
                    setApartamentNumber={setApartamentNumber}
                    name={name}
                    setName={setName}
                    surname={surname}
                    setSurname={setSurname}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-slate-950 font-black">Cancel</AlertDialogCancel>
                  <Button onClick={handleShipping} className={`bg-blue-600 font-black ${isShipping ? 'block' : 'hidden'}`}>
                      Add Shipping Info
                  </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
