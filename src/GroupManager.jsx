// src/components/GroupManager.jsx

import { useState } from 'react';
import './GroupManager.css';
import PropTypes from 'prop-types';

const GroupManager = ({ joinGroup, leaveGroup, currentGroup }) => {
  const [groupName, setGroupName] = useState('');

  const handleJoin = () => {
    if (groupName.trim() === '') {
      alert('Please enter a valid group name.');
      return;
    }
    joinGroup(groupName.trim());
    setGroupName('');
  };

  const handleLeave = () => {
    if (currentGroup) {
      leaveGroup(currentGroup);
    } else {
      alert('You are not part of any group.');
    }
  };

  return (
    <div className="group-manager">
      <h2>Group Management</h2>
      <div className="form-group">
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter Group Name"
          className="input-group"
        />
        <button onClick={handleJoin} className="btn join-btn">Join Group</button>
      </div>
      <div className="form-group">
        <button onClick={handleLeave} className="btn leave-btn">Leave Current Group</button>
      </div>
      {currentGroup && <p className="current-group">Current Group: <strong>{currentGroup}</strong></p>}
    </div>
  );
};
GroupManager.propTypes = {
  joinGroup: PropTypes.func.isRequired,
  leaveGroup: PropTypes.func.isRequired,
  currentGroup: PropTypes.string,
};

export default GroupManager;
