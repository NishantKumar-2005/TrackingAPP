// src/components/DeviceList.jsx
import './DeviceList.css';
import PropTypes from 'prop-types';
import useDeviceId from '../hooks/useDeviceId';

const DeviceList = ({ deviceLocations }) => {
  const deviceId = useDeviceId();

  return (
    <div className="device-list">
      <h3>Devices in Group</h3>
      {Object.keys(deviceLocations).length === 0 ? (
        <p>No devices are currently being tracked in this group.</p>
      ) : (
        <ul>
          {Object.entries(deviceLocations).map(([id, loc]) => (
            <li key={id} className={id === deviceId ? 'current-device' : ''}>
              <strong>{id === deviceId ? 'You' : id}</strong>: 
              ({loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}) <br />
              <small>Last Updated: {new Date(loc.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
DeviceList.propTypes = {
  deviceLocations: PropTypes.object.isRequired,
};

export default DeviceList;

