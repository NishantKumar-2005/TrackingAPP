// src/App.jsx

import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import MapView from './MapView';
import SendLocationForm from './SendLocationForm';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { throttle } from 'lodash';

const App = () => {
  const [connection, setConnection] = useState(null);
  const [deviceLocations, setDeviceLocations] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [userDeviceId] = useState(() => {
    const storedId = localStorage.getItem('userDeviceId');
    if (storedId) {
      return storedId;
    } else {
      const newId = uuidv4();
      localStorage.setItem('userDeviceId', newId);
      return newId;
    }
  });

  // Function to send location data
  const sendLocation = useCallback(async (deviceId, latitude, longitude) => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      try {
        await connection.invoke('SendLocation', deviceId, latitude, longitude);
        console.log('Location sent:', deviceId, latitude, longitude);
      } catch (err) {
        console.error('Error sending location:', err);
      }
    } else {
      console.log('Not connected to the server.');
    }
  }, [connection]);

  useEffect(() => {
    // Initialize SignalR connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://asp-dotnet-projects.onrender.com/trackingHub') // Replace with your actual hub URL
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Setup event listeners
    newConnection.on('ReceiveLocation', (deviceId, latitude, longitude) => {
      setDeviceLocations((prevLocations) => ({
        ...prevLocations,
        [deviceId]: {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        },
      }));
    });

    newConnection.onreconnecting(() => {
      console.assert(newConnection.state === signalR.HubConnectionState.Reconnecting);
      setConnectionStatus('Reconnecting...');
    });

    newConnection.onreconnected(() => {
      console.assert(newConnection.state === signalR.HubConnectionState.Connected);
      setConnectionStatus('Connected');
    });

    newConnection.onclose(() => {
      console.assert(newConnection.state === signalR.HubConnectionState.Disconnected);
      setConnectionStatus('Disconnected');
    });

    // Start the connection
    newConnection
      .start()
      .then(() => {
        console.log('Connected to SignalR Hub');
        setConnectionStatus('Connected');
        setConnection(newConnection);
      })
      .catch((err) => {
        console.error('Connection failed: ', err);
        setConnectionStatus('Disconnected');
      });

    // Cleanup on unmount
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  // Geolocation Tracking with Throttling
  useEffect(() => {
    if (!connection) return;

    const throttledSendLocation = throttle((position) => {
      const { latitude, longitude } = position.coords;
      sendLocation(userDeviceId, latitude, longitude);
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
  }, [connection, sendLocation, userDeviceId]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📍 Real-Time Tracking App</h1>
        <p>
          Status: <span className={`status ${connectionStatus.toLowerCase()}`}>{connectionStatus}</span>
        </p>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <MapView deviceLocations={deviceLocations} currentDeviceId={userDeviceId} />
        </div>
        <div className="right-panel">
          <SendLocationForm sendLocation={sendLocation} />
          <div className="device-list">
            <h2>Devices</h2>
            {Object.keys(deviceLocations).length === 0 ? (
              <p>No devices are currently being tracked.</p>
            ) : (
              <ul>
                {Object.entries(deviceLocations).map(([deviceId, loc]) => (
                  <li key={deviceId}>
                    <strong>{deviceId}</strong>: ({loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}) <br />
                    <small>Last Updated: {new Date(loc.timestamp).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Real-Time Tracking App</p>
      </footer>
    </div>
  );
};

export default App;
