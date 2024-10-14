// src/components/MapView.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';

// Fix default marker icon issues with webpack
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
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Use a distinct color
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapView = ({ deviceLocations, currentDeviceId }) => {
  // Set default center to a neutral location (e.g., geographical center)
  const defaultPosition = [20, 0]; // Latitude, Longitude

  return (
    <MapContainer center={defaultPosition} zoom={2} scrollWheelZoom={true} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.keys(deviceLocations).map((deviceId) => {
        const { latitude, longitude, timestamp } = deviceLocations[deviceId];
        const isCurrentDevice = deviceId === currentDeviceId;
        const markerIcon = isCurrentDevice ? currentUserIcon : new L.Icon.Default();

        return (
          <Marker key={deviceId} position={[latitude, longitude]} icon={markerIcon}>
            <Popup>
              <strong>Device ID:</strong> {deviceId} <br />
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
  currentDeviceId: PropTypes.string.isRequired,
};

export default MapView;
