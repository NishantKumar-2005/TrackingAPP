// src/components/GeoTracker.jsx

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import signalRService from '../services/signalRService';
import useDeviceId from '../hooks/useDeviceId';

const GeoTracker = ({ currentGroup }) => {
  const deviceId = useDeviceId();

  useEffect(() => {
    if (!currentGroup) return;

    const throttledSendLocation = throttle((position) => {
      const { latitude, longitude } = position.coords;
      signalRService.sendGroupLocation(currentGroup, deviceId, latitude, longitude);
    }, 5000); // Send location at most every 5 seconds

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        throttledSendLocation,
        (error) => {
          console.error('Error obtaining location:', error);
          alert('Error obtaining location. Please ensure location services are enabled.');
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000, // Maximum age of cached position
          timeout: 5000, // Timeout in milliseconds
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
        throttledSendLocation.cancel();
      };
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, [currentGroup, deviceId]);

  return null; // This component doesn't render anything
};
GeoTracker.propTypes = {
  currentGroup: PropTypes.string.isRequired,
};

export default GeoTracker;
