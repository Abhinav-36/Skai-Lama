import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEventLogs } from '../store/eventSlice';
import { formatDateTime, formatDate, formatTime } from '../utils/dateUtils';
import EventLogs from './EventLogs';
import Modal from './Modal';
import './EventItem.css';

const EventItem = ({ event, onEdit }) => {
  const dispatch = useDispatch();
  const selectedTimezone = useSelector((state) => state.event.selectedTimezone);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const viewLogs = async () => {
    if (showLogsModal) {
      setShowLogsModal(false);
      return;
    }

    setLoadingLogs(true);
    try {
      const res = await dispatch(fetchEventLogs(event._id));
      if (fetchEventLogs.fulfilled.match(res)) {
        setLogs(res.payload);
        setShowLogsModal(true);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const createdDisplay = useMemo(
    () => formatDateTime(event.createdAt, selectedTimezone),
    [event.createdAt, selectedTimezone]
  );
  
  const updatedDisplay = useMemo(
    () => formatDateTime(event.updatedAt, selectedTimezone),
    [event.updatedAt, selectedTimezone]
  );

  const profileNames = Array.isArray(event.profiles) 
    ? event.profiles.map(p => p.name).join(', ')
    : '';

  return (
    <div className="event-item">
      <div className="event-header">
        <div className="event-profiles">
          {profileNames}
        </div>
      </div>

      <div className="event-details">
        <div className="event-time">
          <div className="time-row">
            <span className="label">Start:</span>
            <span className="value">{formatDate(event.startDateTime, selectedTimezone)}</span>
            <span className="time-value">{formatTime(event.startDateTime, selectedTimezone)}</span>
          </div>
          <div className="time-row">
            <span className="label">End:</span>
            <span className="value">{formatDate(event.endDateTime, selectedTimezone)}</span>
            <span className="time-value">{formatTime(event.endDateTime, selectedTimezone)}</span>
          </div>
        </div>

        <div className="event-meta">
          <div className="meta-row">
            <span className="meta-label">Created:</span>
            <span className="meta-value">{createdDisplay}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Updated:</span>
            <span className="meta-value">{updatedDisplay}</span>
          </div>
        </div>
      </div>

      <div className="event-actions">
        <button className="edit-btn" onClick={() => onEdit(event)}>
          ✏️ Edit
        </button>
        <button
          className="logs-btn"
          onClick={viewLogs}
          disabled={loadingLogs}
        >
          {loadingLogs ? 'Loading...' : '📄 View Logs'}
        </button>
      </div>

      <Modal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        title="Event Update History"
      >
        <EventLogs logs={logs} />
      </Modal>
    </div>
  );
};

export default EventItem;


