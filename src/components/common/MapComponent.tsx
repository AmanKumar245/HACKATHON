import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import { Coordinates, CrimeReport, CrimeType } from '../../types';
import { AlertTriangle, Flag, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

interface MapComponentProps {
  reports?: CrimeReport[];
  height?: string;
  initialPosition?: Coordinates;
  onLocationSelect?: (location: Coordinates) => void;
  selectable?: boolean;
  zoom?: number;
}

// Custom hook to set map view and handle user location
const SetViewOnClick = ({ coords, zoom }: { coords: LatLngExpression, zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], zoom);
      },
      (error) => {
        console.error('Error getting location:', error);
        // Fall back to default position
        map.setView(coords, zoom);
      }
    );
  }, []);

  return null;
};

// Marker that follows clicks with reverse geocoding
const LocationMarker: React.FC<{ onLocationSelect: (location: Coordinates) => void }> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<Coordinates | null>(null);
  
  const map = useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(newPos);
      
      // Reverse geocoding using OpenStreetMap Nominatim API
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}`)
        .then(response => response.json())
        .then(data => {
          const address = data.display_name;
          onLocationSelect({ ...newPos, address });
        })
        .catch(error => {
          console.error('Error getting address:', error);
          onLocationSelect(newPos);
        });
    },
  });

  return position === null ? null : (
    <Marker position={[position.lat, position.lng]} />
  );
};

const crimeTypeIcons = {
  theft: <Flag className="h-6 w-6 text-yellow-500" />,
  assault: <ShieldAlert className="h-6 w-6 text-red-500" />,
  vandalism: <Flag className="h-6 w-6 text-blue-500" />,
  burglary: <Flag className="h-6 w-6 text-purple-500" />,
  robbery: <ShieldAlert className="h-6 w-6 text-orange-500" />,
  emergency: <AlertTriangle className="h-6 w-6 text-red-600" />,
  other: <Flag className="h-6 w-6 text-gray-500" />,
};

const MapComponent: React.FC<MapComponentProps> = ({
  reports = [],
  height = '500px',
  initialPosition = { lat: 12.97, lng: 77.59 }, // Bengaluru
  onLocationSelect,
  selectable = false,
  zoom = 13,
}) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    // Get user's location on component mount
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  return (
    <div className="rounded-lg overflow-hidden border border-gray-300" style={{ height }}>
      <MapContainer
        center={[userLocation?.lat || initialPosition.lat, userLocation?.lng || initialPosition.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <SetViewOnClick 
          coords={[userLocation?.lat || initialPosition.lat, userLocation?.lng || initialPosition.lng]} 
          zoom={zoom} 
        />
        
        {selectable && onLocationSelect && (
          <LocationMarker onLocationSelect={onLocationSelect} />
        )}
        
        {/* User's current location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg">Your Location</h3>
              </div>
            </Popup>
          </Marker>
        )}
        
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.location.lat, report.location.lng]}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  {crimeTypeIcons[report.crimeType]}
                  <h3 className="font-semibold text-lg capitalize">
                    {report.crimeType}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {report.address}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {format(new Date(report.date), 'PPP p')}
                </p>
                {report.description && (
                  <p className="text-sm">{report.description}</p>
                )}
                <div className="mt-2 text-xs py-1 px-2 inline-block rounded-full bg-gray-100">
                  Status: <span className="font-semibold capitalize">{report.status}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;