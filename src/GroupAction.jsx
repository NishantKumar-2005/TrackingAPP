// src/components/GroupActions.jsx

import  { useState } from 'react';
import PropTypes from 'prop-types';
import './GroupActions.css';

const GroupActions = ({ addToGroup, removeFromGroup, currentGroup }) => {
  const [groupInput, setGroupInput] = useState('');

  const handleJoin = () => {
    if (!groupInput.trim()) {
      alert('Please enter a valid group name.');
      return;
    }
    addToGroup(groupInput.trim());
    setGroupInput('');
  };

  const handleLeave = () => {
    if (!currentGroup) {
      alert('You are not part of any group.');
      return;
    }
    removeFromGroup(currentGroup);
  };

  return (
    <div className="group-actions">
      <h2>Group Actions</h2>
      <div className="action-group">
        <input
          type="text"
          value={groupInput}
          onChange={(e) => setGroupInput(e.target.value)}
          placeholder="Enter Group Name"
          className="input-group"
        />
        <button onClick={handleJoin} className="btn join-btn">Join Group</button>
        <button onClick={handleLeave} className="btn leave-btn">Leave Group</button>
      </div>
      {currentGroup && <p className="current-group">Currently in group: <strong>{currentGroup}</strong></p>}
    </div>
  );
};
GroupActions.propTypes = {
  addToGroup: PropTypes.func.isRequired,
  removeFromGroup: PropTypes.func.isRequired,
  currentGroup: PropTypes.string,
};

export default GroupActions;
