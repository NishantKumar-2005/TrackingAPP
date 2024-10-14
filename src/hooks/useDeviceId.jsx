// src/hooks/useDeviceId.js

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    let storedId = localStorage.getItem('deviceId');
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem('deviceId', storedId);
    }
    setDeviceId(storedId);
  }, []);

  return deviceId;
};

export default useDeviceId;
