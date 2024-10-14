// src/components/MapView.jsx
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';
import useDeviceId from '../hooks/useDeviceId';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for current user
const currentUserIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapView = ({ deviceLocations }) => {
  const deviceId = useDeviceId();

  // Set default center to the user's current location or a fallback
  const userLocation = deviceLocations[deviceId]
    ? [deviceLocations[deviceId].latitude, deviceLocations[deviceId].longitude]
    : [20, 0]; // Default to equator if no location yet

  return (
    <MapContainer center={userLocation} zoom={2} scrollWheelZoom={true} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.keys(deviceLocations).map((id) => {
        const { latitude, longitude, timestamp } = deviceLocations[id];
        const isCurrentDevice = id === deviceId;
        const markerIcon = isCurrentDevice ? currentUserIcon : new L.Icon.Default();

        return (
          <Marker key={id} position={[latitude, longitude]} icon={markerIcon}>
            <Popup>
              <strong>Device ID:</strong> {id === deviceId ? 'You' : id} <br />
              <strong>Last Updated:</strong> {new Date(timestamp).toLocaleString()}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};
MapView.propTypes = {
  deviceLocations: PropTypes.object.isRequired,
};

export default MapView;

