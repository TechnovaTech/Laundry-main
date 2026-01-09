import { useEffect, useState } from 'react';

interface LeafletMapProps {
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const LeafletMap = ({ address }: LeafletMapProps) => {
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    const apiKey = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';
    
    // Build complete address string for better accuracy
    const addressParts = [
      address.street ? String(address.street).trim() : '',
      address.city ? String(address.city).trim() : '', 
      address.state ? String(address.state).trim() : '',
      address.pincode ? String(address.pincode).trim() : '',
      'India'
    ].filter(Boolean); // Remove empty parts
    
    const fullAddress = addressParts.join(', ');
    const encodedQuery = encodeURIComponent(fullAddress);
    
    setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedQuery}&zoom=16&maptype=roadmap`);
  }, [address]);

  if (!mapUrl) {
    return (
      <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <iframe
      src={mapUrl}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="w-full h-full rounded-xl"
      title="Address Location Map"
    />
  );
};

export default LeafletMap;