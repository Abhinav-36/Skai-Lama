import React from 'react';
import { useSelector } from 'react-redux';
import { formatDateTime } from '../utils/dateUtils';
import './EventLogs.css';

const EventLogs = ({ logs }) => {
  const selectedTimezone = useSelector((state) => state.event.selectedTimezone);

  if (!logs || logs.length === 0) {
    return (
      <div className="event-logs-modal">
        <p className="no-logs">No update history yet</p>
      </div>
    );
  }

  return (
    <div className="event-logs-modal">
      <div className="logs-list">
        {logs.map((log, idx) => {
          const hasTzChange = log.changes.some(c => c.field === 'timezone');
          const changes = hasTzChange
            ? log.changes.filter(c => {
                const isDT = c.field === 'startDateTime' || c.field === 'startDate' || 
                           c.field === 'startTime' || c.field === 'endDateTime' || 
                           c.field === 'endDate' || c.field === 'endTime';
                return !isDT;
              })
            : log.changes;

          return (
            <div key={idx} className="log-entry">
              <div className="log-timestamp">
                <span className="clock-icon">🕐</span>
                {formatDateTime(log.createdAt, selectedTimezone)}
              </div>
              <div className="log-changes">
                {changes.map((change, i) => (
                  <div key={i} className="change-item">
                    {formatLogChange(change)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const formatChangeValue = (value) => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  if (value instanceof Date) {
    return new Date(value).toLocaleString();
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return String(value);
};

const formatLogChange = (change) => {
  if (change.field === 'profiles') {
    const val = Array.isArray(change.newValue) 
      ? change.newValue.map(p => p.name || p).join(', ') 
      : formatChangeValue(change.newValue);
    return <span className="change-text">Profiles changed to: {val}</span>;
  }
  
  if (change.field === 'startDateTime' || change.field === 'startDate' || change.field === 'startTime') {
    return <span className="change-text">Start date/time updated</span>;
  }
  
  if (change.field === 'endDateTime' || change.field === 'endDate' || change.field === 'endTime') {
    return <span className="change-text">End date/time updated</span>;
  }
  
  if (change.field === 'timezone') {
    return <span className="change-text">Timezone changed to: {formatChangeValue(change.newValue)}</span>;
  }
  
  const field = change.field.charAt(0).toUpperCase() + change.field.slice(1).replace(/([A-Z])/g, ' $1').trim();
  return (
    <>
      <span className="change-field">{field}:</span>
      <span className="change-old">{formatChangeValue(change.oldValue)}</span>
      <span className="change-arrow">→</span>
      <span className="change-new">{formatChangeValue(change.newValue)}</span>
    </>
  );
};

export default EventLogs;


