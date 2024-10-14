// src/components/GroupManager.jsx

import  { useState } from 'react';
import PropTypes from 'prop-types';
import signalRService from '../services/signalRService';
import './GroupManager.css';

const GroupManager = ({ currentGroup, setCurrentGroup }) => {
  const [groupInput, setGroupInput] = useState('');

  const handleJoin = () => {
    const trimmedGroup = groupInput.trim();
    if (trimmedGroup) {
      signalRService.joinGroup(trimmedGroup);
      setCurrentGroup(trimmedGroup);
      setGroupInput('');
    } else {
      alert('Please enter a valid group name.');
    }
  };

  const handleLeave = () => {
    if (currentGroup) {
      signalRService.leaveGroup(currentGroup);
      setCurrentGroup('');
    }
  };

  return (
    <div className="group-manager">
      {!currentGroup ? (
        <div className="join-group">
          <input
            type="text"
            placeholder="Enter group name"
            value={groupInput}
            onChange={(e) => setGroupInput(e.target.value)}
          />
          <button onClick={handleJoin} className="btn join-btn">Join Group</button>
        </div>
      ) : (
        <div className="current-group">
          <span>Joined Group: <strong>{currentGroup}</strong></span>
          <button onClick={handleLeave} className="btn leave-btn">Leave Group</button>
        </div>
      )}
    </div>
  );
};
GroupManager.propTypes = {
  currentGroup: PropTypes.string,
  setCurrentGroup: PropTypes.func.isRequired,
};

export default GroupManager;

