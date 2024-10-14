// src/App.jsx

import { useState, useEffect } from 'react';
import './App.css';
import signalRService from './services/signalRService';
import GroupManager from './components/GroupManager';
import GeoTracker from './components/GeoTracker';
import MapView from './components/MapView';
import DeviceList from './components/DeviceList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [currentGroup, setCurrentGroup] = useState('');
  const [deviceLocations, setDeviceLocations] = useState({});

  useEffect(() => {
    // Start SignalR connection on mount
    signalRService.startConnection();

    // Register event listeners
    signalRService.on('ReceiveGroupLocation', (deviceId, latitude, longitude) => {
      setDeviceLocations((prev) => ({
        ...prev,
        [deviceId]: {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        },
      }));
    });

    signalRService.on('ReceiveGroupNotification', (message) => {
      // Notifications are already handled via toast in the service
      console.log('Group Notification:', message);
    });

    // Cleanup on unmount
    return () => {
      signalRService.off('ReceiveGroupLocation');
      signalRService.off('ReceiveGroupNotification');
    };
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <header className="App-header">
        <h1>📍 Real-Time Group Location Tracker</h1>
      </header>
      <main>
        <GroupManager currentGroup={currentGroup} setCurrentGroup={setCurrentGroup} />
        {currentGroup && <GeoTracker currentGroup={currentGroup} />}
        <div className="map-and-list">
          <MapView deviceLocations={deviceLocations} />
          <DeviceList deviceLocations={deviceLocations} />
        </div>
      </main>
      <footer className="App-footer">
        <p>&copy; {new Date().getFullYear()} Real-Time Group Location Tracker</p>
      </footer>
    </div>
  );
}

export default App;
