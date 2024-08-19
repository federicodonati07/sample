import React from 'react';

const ShippingInfo = ({
  country,
  state,
  city,
  address,
  house_number,
  apartament_number,
  postal_code,
  phone_number,
  more_info
}) => {
  return (
    <div className="border-slate-50 border-b">
      <div className="flex flex-col justify-center items-center text-center">
        <div className="p-2">
          <span className="font-black">Shipping Information</span>
        </div>
        <div className="overflow-auto flex flex-col justify-start items-start text-start p-2">
          <span>Country: <span className="font-black">{country}</span></span>
          <span>State: <span className="font-black">{state}</span></span>
          <span>City: <span className="font-black">{city}</span></span>
          <span>Address: <span className="font-black">{address}</span></span>
          <span>House Number: <span className="font-black">{house_number}</span></span>
          <span>Apartament Number: <span className="font-black">{apartament_number}</span></span>
          <span>Postal Code: <span className="font-black">{postal_code}</span></span>
          <span>Phone Number: <span className="font-black">{phone_number}</span></span>
          <span>More Info: <span className="font-black">{more_info}</span></span>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
