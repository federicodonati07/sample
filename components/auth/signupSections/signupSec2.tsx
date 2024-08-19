import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Country, State, City } from 'country-state-city';

const SignupSec2 = ({
    shippingAddress,
    setShippingAddress,
    houseNumber,
    setHouseNumber,
    postalCode,
    setPostalCode,
    moreInfo,
    setMoreInfo,
    selectedCountry,
    setSelectedCountry,
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    phoneNumber,
    setPhoneNumber,
    apartamentNumber,
    setApartamentNumber,
    name,
    setName,
    surname,
    setSurname
}) => {
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
        setPhoneNumber(event.target.value);
    };

    return (
        <>
            <div className='space-y-2'>
                <form className='space-y-4'>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label htmlFor='name'>Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor='surname'>Surname</Label>
                            <Input
                                id="surname"
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                        </div>
                    </div>
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

                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label htmlFor='shippingAddress'>Address</Label>
                            <Input
                                id="shippingAddress"
                                type="text"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor='postalCode'>Postal Code</Label>
                            <Input
                                id="postalCode"
                                type="text"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                         <div>
                            <Label htmlFor='houseNumber'>House Number</Label>
                            <Input
                                id="houseNumber"
                                type="text"
                                value={houseNumber}
                                onChange={(e) => setHouseNumber(e.target.value)}
                            />
                        </div>
                         <div>
                            <Label htmlFor='apartamentNumber'>Apartament number</Label>
                            <Input
                                id="apartamentNumber"
                                type="text"
                                value={apartamentNumber}
                                onChange={(e) => setApartamentNumber(e.target.value)}
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
                    <div>
                        <Label htmlFor='moreInfo'>More Info</Label>
                        <Input
                            id='moreInfo'
                            type='textarea'
                            value={moreInfo}
                            onChange={(e) => setMoreInfo(e.target.value)}
                            className='w-full p-2 border border-gray-300 rounded'
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default SignupSec2;
