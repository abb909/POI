import React from 'react';

const StatsCard = ({ title, value, percentage, icon: Icon, onClick }) => {
  return (
    <div className="stats-card" onClick={onClick}>
      <div className="stats-header">
        <span className="stats-title">{title}</span>
        {percentage && (
          <div className="stats-percentage">{percentage}</div>
        )}
      </div>
      <div className="stats-value">{value}</div>
      {Icon && (
        <div className="stats-icon">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatsCard;