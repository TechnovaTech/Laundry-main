import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const LeafletMap = ({ address }: LeafletMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [coordinates, setCoordinates] = useState({ lat: 28.6139, lng: 77.2090 });

  // Geocode address to get coordinates
  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        // Try multiple search strategies for better accuracy
        const queries = [
          `${address.street}, ${address.city}, ${address.state}, ${address.pincode}, India`,
          `${address.city}, ${address.state}, ${address.pincode}, India`,
          `${address.city}, ${address.state}, India`,
          `${address.pincode}, India`
        ];
        
        for (const query of queries) {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=in`);
          const data = await response.json();
          
          if (data && data.length > 0) {
            console.log('Geocoded location:', data[0]);
            setCoordinates({
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            });
            return; // Stop at first successful result
          }
        }
      } catch (error) {
        console.error('Geocoding failed:', error);
      }
    };

    if (address.city && address.state) {
      geocodeAddress();
    }
  }, [address]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up existing map
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    // Create new map with coordinates
    mapInstance.current = L.map(mapRef.current).setView([coordinates.lat, coordinates.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // Add marker
    L.marker([coordinates.lat, coordinates.lng]).addTo(mapInstance.current)
      .bindPopup(`${address.street}, ${address.city}`)
      .openPopup();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [coordinates, address]);

  return <div ref={mapRef} className="w-full h-full rounded-xl" />;
};

export default LeafletMap;