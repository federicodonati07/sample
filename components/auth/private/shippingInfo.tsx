import React, { useEffect, useState } from 'react';
import { Country, State, City } from 'country-state-city';
import { Input } from '@/components/ui/input';
import { isValidNumber, parsePhoneNumber } from 'libphonenumber-js';
import { Button } from '@/components/ui/button';

const ShippingInfo = ({
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
  const [inputCountryValue, setInputCountryValue] = useState<string>(country || '');
  const [inputStateValue, setInputStateValue] = useState<string>(state || '');
  const [inputCityValue, setInputCityValue] = useState<string>(city || '');
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
    if (inputCountryValue) {
      setStates(State.getStatesOfCountry(inputCountryValue));
    } else {
      setStates([]);
    }
  }, [inputCountryValue]);

  useEffect(() => {
    if (inputStateValue) {
      setCities(City.getCitiesOfState(inputCountryValue, inputStateValue));
    } else {
      setCities([]);
    }
  }, [inputStateValue, inputCountryValue]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputCountryValue(event.target.value);
    setInputStateValue('');
    setInputCityValue('');
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputStateValue(event.target.value);
    setInputCityValue('');
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputCityValue(event.target.value);
  };

  const handleEdit = () => {
    if (
      inputAddressValue !== '' &&
      inputHouseNumberValue !== '' &&
      inputApartamentNumberValue !== '' &&
      inputPostalCodeValue !== '' &&
      inputPhoneNumberValue !== '' &&
      inputMoreInfoValue !== '' &&
      inputCountryValue !== '' &&
      inputStateValue !== '' &&
      inputCityValue !== ''
    ) {
      try {
        const phone = parsePhoneNumber(inputPhoneNumberValue);
        if (!phone || !isValidNumber(phone.number)) {
          setIsInvalidNumber(true);
        } else {
          setIsInvalidNumber(false);
          // code here
        }
      } catch {
        setIsInvalidNumber(true);
      }
    } else {
      // Gestisci il caso in cui uno o più campi siano vuoti
      alert("Please fill in all required fields.");
    }
  };

  useEffect(() => {
    setInputAddressValue(address);
    setInputHouseNumberValue(house_number);
    setInputApartamentNumberValue(apartament_number);
    setInputPostalCodeValue(postal_code);
    setInputPhoneNumberValue(phone_number);
    setInputMoreInfoValue(more_info);
    setInputCountryValue(country);
    setInputStateValue(state);
    setInputCityValue(city);
  }, [address, house_number, apartament_number, postal_code, phone_number, more_info, country, state, city]);

  return (
    <div className="border-slate-50 border-b">
      <div className="flex flex-col justify-center items-center text-center">
        <div className="p-2">
          <span className="font-black">Shipping Information</span>
        </div>
        <div className="overflow-auto flex flex-col justify-start items-start text-start p-2">
          <div className="grid grid-cols-2 gap-2 items-center m-2">
            <span className="text-lg font-semibold">Country:</span>
            <select
              value={inputCountryValue}
              onChange={handleCountryChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center m-2">
            <span className="text-lg font-semibold">State:</span>
            <select
              value={inputStateValue}
              onChange={handleStateChange}
              className="p-2 border border-gray-300 rounded"
              disabled={!inputCountryValue}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center m-2">
            <span className="text-lg font-semibold">City:</span>
            <select
              value={inputCityValue}
              onChange={handleCityChange}
              className="p-2 border border-gray-300 rounded"
              disabled={!inputStateValue}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 m-2 text-xl">
            <span>Address:</span>
            <Input
              type="text"
              value={inputAddressValue}
              onChange={(e) => setInputAddressValue(e.target.value)}
              placeholder="Insert a value"
              className="font-black"
            />
          </div>
          <div className="grid grid-cols-2 m-2 text-xl">
            <span>House N.:</span>
            <Input
              type="text"
              value={inputHouseNumberValue}
              onChange={(e) => setInputHouseNumberValue(e.target.value)}
              placeholder="Insert a value"
              className="font-black"
            />
          </div>
          <div className="grid grid-cols-2 m-2 text-xl">
            <span>Apartament N.:</span>
            <Input
              type="text"
              value={inputApartamentNumberValue}
              onChange={(e) => setInputApartamentNumberValue(e.target.value)}
              placeholder="Insert a value"
              className="font-black"
            />
          </div>

          <div className="grid grid-cols-2 m-2 text-xl">
            <span>Postal Code:</span>
            <Input
              type="text"
              value={inputPostalCodeValue}
              onChange={(e) => setInputPostalCodeValue(e.target.value)}
              placeholder="Insert a value"
              className="font-black"
            />
          </div>
          <div className="grid grid-cols-2 m-2 text-xl">
            {isInvalidNumber ? (
              <span className="text-red-600">Invalid Phone N.</span>
            ) : (
              <span className="text-slate-50">Phone N.:</span>
            )}
            <Input
              type="tel"
              value={inputPhoneNumberValue}
              onChange={(e) => setInputPhoneNumberValue(e.target.value)}
              placeholder="Insert a value"
              className="font-black"
            />
          </div>
          <div className="grid grid-cols-2 m-2 text-xl">
            <span>More Info:</span>
            <Input
              type="textarea"
              value={inputMoreInfoValue}
              onChange={(e) => setInputMoreInfoValue(e.target.value)}
              placeholder="Insert a value"
              className="font-black"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Button onClick={handleEdit} className="bg-slate-50 text-slate-950 m-2">
          Edit Shipping Info
        </Button>
      </div>
    </div>
  );
};

export default ShippingInfo;
