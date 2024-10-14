// src/components/SendLocationForm.jsx

import React, { useState } from 'react';
import './SendLocationForm.css';
import PropTypes from 'prop-types';

const SendLocationForm = ({ sendLocation }) => {
  const [deviceId, setDeviceId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!deviceId || !latitude || !longitude) {
      alert('Please fill in all fields.');
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      alert('Please enter valid numbers for latitude and longitude.');
      return;
    }

    // Send location
    sendLocation(deviceId, lat, lon);

    // Reset form
    setDeviceId('');
    setLatitude('');
    setLongitude('');
    setStatus('Location sent successfully!');
    setTimeout(() => setStatus(''), 3000); // Clear status after 3 seconds
  };

  return (
    <div className="send-location-form">
      <h2>Send Location</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deviceId">Device ID:</label>
          <input
            type="text"
            id="deviceId"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Enter Device ID"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="number"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Enter Latitude"
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="number"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Enter Longitude"
            step="any"
            required
          />
        </div>
        <button type="submit" className="send-btn">Send Location</button>
      </form>
      {status && <div className="status-message">{status}</div>}
    </div>
  );
};
SendLocationForm.propTypes = {
  sendLocation: PropTypes.func.isRequired,
};

export default SendLocationForm;
