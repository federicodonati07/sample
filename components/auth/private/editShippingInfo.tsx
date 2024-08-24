import React, { useEffect, useState } from 'react';
import { Country, State, City } from 'country-state-city';
import { Input } from '@/components/ui/input';
import { isValidNumber, parsePhoneNumber } from 'libphonenumber-js';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import supabase from '@/lib/supabase/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditShippingInfo = ({
  country,
  state,
  city,
  address,
  house_number,
  apartament_number,
  postal_code,
  phone_number,
  more_info,
  uuid,
}) => {
  // Initialize state values with 'unassigned' as default where appropriate
  const [inputCountryValue, setInputCountryValue] = useState<string>(country || 'unassigned');
  const [inputStateValue, setInputStateValue] = useState<string>(state || 'unassigned');
  const [inputCityValue, setInputCityValue] = useState<string>(city || 'unassigned');
  const [inputAddressValue, setInputAddressValue] = useState<string>(address || '');
  const [inputHouseNumberValue, setInputHouseNumberValue] = useState<string>(house_number || '');
  const [inputApartamentNumberValue, setInputApartamentNumberValue] = useState<string>(apartament_number || '');
  const [inputPostalCodeValue, setInputPostalCodeValue] = useState<string>(postal_code || '');
  const [inputPhoneNumberValue, setInputPhoneNumberValue] = useState<string>(phone_number || '');
  const [inputMoreInfoValue, setInputMoreInfoValue] = useState<string>(more_info || '');

  const [isInvalidNumber, setIsInvalidNumber] = useState<boolean>(false);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (inputCountryValue !== 'unassigned') {
      setStates(State.getStatesOfCountry(inputCountryValue));
    } else {
      setStates([]);
    }
  }, [inputCountryValue]);

  useEffect(() => {
    if (inputStateValue !== 'unassigned') {
      setCities(City.getCitiesOfState(inputCountryValue, inputStateValue));
    } else {
      setCities([]);
    }
  }, [inputStateValue, inputCountryValue]);

  const handleCountryChange = (value: string) => {
    setInputCountryValue(value === 'unassigned' ? '' : value);
    setInputStateValue('unassigned');
    setInputCityValue('unassigned');
  };

  const handleStateChange = (value: string) => {
    setInputStateValue(value === 'unassigned' ? '' : value);
    setInputCityValue('unassigned');
  };

  const handleCityChange = (value: string) => {
    setInputCityValue(value === 'unassigned' ? '' : value);
  };

  const handleEdit = async() => {
    if (
      inputAddressValue !== '' &&
      inputHouseNumberValue !== '' &&
      inputApartamentNumberValue !== '' &&
      inputPostalCodeValue !== '' &&
      inputPhoneNumberValue !== '' &&
      inputCountryValue !== 'unassigned' &&
      inputStateValue !== 'unassigned' &&
      inputCityValue !== 'unassigned'
    ) {
      try {
        const phone = parsePhoneNumber(inputPhoneNumberValue);
        if (!phone || !isValidNumber(phone.number)) {
          setIsInvalidNumber(true);
        } else {
          setIsInvalidNumber(false);

          const {data, error} = await supabase
            .from("shipping_info")
            .update([{
              country: inputCountryValue,
              state: inputStateValue,
              city: inputCityValue,
              address: inputAddressValue,
              house_number: inputHouseNumberValue,
              apartament_number: inputApartamentNumberValue,
              postal_code: inputPostalCodeValue,
              phone_number: inputPhoneNumberValue,
              more_info: inputMoreInfoValue,
            }])
            .eq("profile_uuid", uuid)

          if(error){
            toast.error(`Error: ${error.message}`)
          }else{
            toast.success("Shipping info edited successfully")
          }
        }
      } catch {
        setIsInvalidNumber(true);
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  useEffect(() => {
    setInputAddressValue(address || '');
    setInputHouseNumberValue(house_number || '');
    setInputApartamentNumberValue(apartament_number || '');
    setInputPostalCodeValue(postal_code || '');
    setInputPhoneNumberValue(phone_number || '');
    setInputMoreInfoValue(more_info || '');
    setInputCountryValue(country || 'unassigned');
    setInputStateValue(state || 'unassigned');
    setInputCityValue(city || 'unassigned');
  }, [address, house_number, apartament_number, postal_code, phone_number, more_info, country, state, city]);

  return (
    <>
      <div className="lg:border lg:border-gray-300 lg:rounded-lg p-4 lg:max-w-3xl lg:mx-auto shadow-lg">
        <div className="text-center mb-4">
          <span className="text-2xl font-bold">Shipping Information</span>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1">Country:</label>
            <Select
              value={inputCountryValue}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-lg">
                <span>{inputCountryValue !== 'unassigned' ? Country.getCountryByCode(inputCountryValue)?.name : 'Select Country'}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Select Country</SelectItem>
                {Country.getAllCountries().map((country) => (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1">State:</label>
            <Select
              value={inputStateValue}
              onValueChange={handleStateChange}
              disabled={inputCountryValue === 'unassigned'}
            >
              <SelectTrigger className="w-full  border border-gray-300 rounded-lg">
                <span>{inputStateValue !== 'unassigned' ? states.find(s => s.isoCode === inputStateValue)?.name : 'Select State'}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Select State</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1">City:</label>
            <Select
              value={inputCityValue}
              onValueChange={handleCityChange}
              disabled={inputStateValue === 'unassigned'}
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-lg">
                <span>{inputCityValue !== 'unassigned' ? cities.find(c => c.name === inputCityValue)?.name : 'Select City'}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Select City</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">Address:</label>
              <Input
                type="text"
                value={inputAddressValue}
                onChange={(e) => setInputAddressValue(e.target.value)}
                placeholder="Insert a value"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">House N.:</label>
              <Input
                type="text"
                value={inputHouseNumberValue}
                onChange={(e) => setInputHouseNumberValue(e.target.value)}
                placeholder="Insert a value"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">Apartament N.:</label>
              <Input
                type="text"
                value={inputApartamentNumberValue}
                onChange={(e) => setInputApartamentNumberValue(e.target.value)}
                placeholder="Insert a value"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">Postal Code:</label>
              <Input
                type="text"
                value={inputPostalCodeValue}
                onChange={(e) => setInputPostalCodeValue(e.target.value)}
                placeholder="Insert a value"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>
          
          <div className="flex flex-col mb-4">
            <label className="text-lg font-semibold mb-1">
              {isInvalidNumber ? (
                <span className="text-red-600">Invalid Phone Number</span>
              ) : (
                'Phone Number (with +):'
              )}
            </label>
            <Input
              type="tel"
              value={inputPhoneNumberValue}
              onChange={(e) => setInputPhoneNumberValue(e.target.value)}
              placeholder="Insert a value"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1">More Info:</label>
            <Input
              type="text"
              value={inputMoreInfoValue}
              onChange={(e) => setInputMoreInfoValue(e.target.value)}
              placeholder="Insert a value"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
        <div className="text-center mt-4">
          <Button onClick={handleEdit} className="bg-slate-50 text-slate-950">
            Edit Shipping Info
          </Button>
        </div>
      </div>
    <ToastContainer />
  </>
  );
};

export default EditShippingInfo;
