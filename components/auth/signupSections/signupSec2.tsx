import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidNumber, parsePhoneNumber } from 'libphonenumber-js';
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Country, State, City } from 'country-state-city';

const SignupSec2 = () => {
    const [error, setError] = useState('');
    const [isError, setIsError] = useState(false);

    // Input variables
    const [shippingAddress, setShippingAddress] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');

    // State variables to capture the selected values
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    // List of countries, states, and cities
    const [countries, setCountries] = useState<Country[]>(Country.getAllCountries());
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    useEffect(() => {
        if (selectedCountry) {
            setStates(State.getStatesOfCountry(selectedCountry));
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedState) {
            setCities(City.getCitiesOfState(selectedCountry, selectedState));
        } else {
            setCities([]);
        }
    }, [selectedState, selectedCountry]);

    // Event handlers to update state variables
    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);
        setSelectedState('');
        setSelectedCity('');
    };

    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedState(event.target.value);
        setSelectedCity('');
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(event.target.value);
    };

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPhoneNumber(value);
        
        try {
            const phone = parsePhoneNumber(value);
            if (phone && isValidNumber(phone.number)) {
                setError('');
                setIsError(false);
            } else {
                setIsError(true);
                setError('Invalid phone number');
            }
        } catch {
            setError('Invalid phone number');
            setIsError(true);
        }
    };

    // Handlers for additional inputs
    const handleShippingAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress(e.target.value);
    };

    const handleHouseNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHouseNumber(e.target.value);
    };

    const handlePostalCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostalCode(e.target.value);
    };

    return (
        <>
            <div className='space-y-2'>
                <Alert variant="destructive" className={`${isError ? 'block' : 'hidden'}`}>
                    <ExclamationTriangleIcon />
                    <AlertTitle>Error: </AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>

                <form className='space-y-4'>
                    <div className='grid grid-cols-3 gap-2'>
                        <div>
                            <Label htmlFor='country'>Country</Label>
                            <select
                                id='country'
                                value={selectedCountry}
                                onChange={handleCountryChange}
                                className='w-full p-2 border border-gray-300 rounded'
                            >
                                <option value=''>Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor='state'>State</Label>
                            <select
                                id='state'
                                value={selectedState}
                                onChange={handleStateChange}
                                className='w-full p-2 border border-gray-300 rounded'
                                disabled={!selectedCountry}
                            >
                                <option value=''>Select State</option>
                                {states.map((state) => (
                                    <option key={state.isoCode} value={state.isoCode}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor='city'>City</Label>
                            <select
                                id='city'
                                value={selectedCity}
                                onChange={handleCityChange}
                                className='w-full p-2 border border-gray-300 rounded'
                                disabled={!selectedState}
                            >
                                <option value=''>Select City</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='grid grid-cols-3 gap-2'>
                        <div>
                            <Label htmlFor='shippingAddress'>Shipping Address</Label>
                            <Input
                                id="shippingAddress"
                                type="text"
                                value={shippingAddress}
                                onChange={handleShippingAddress}
                            />
                        </div>
                        <div>
                            <Label htmlFor='houseNumber'>House Number</Label>
                            <Input
                                id="houseNumber"
                                type="text"
                                value={houseNumber}
                                onChange={handleHouseNumber}
                            />
                        </div>
                        <div>
                            <Label htmlFor='postalCode'>Postal Code</Label>
                            <Input
                                id="postalCode"
                                type="text"
                                value={postalCode}
                                onChange={handlePostalCode}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <Label htmlFor='phone'>Phone Number with +</Label>
                        <Input
                            id='phone'
                            type='tel'
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            className='w-full p-2 border border-gray-300 rounded'
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default SignupSec2;
