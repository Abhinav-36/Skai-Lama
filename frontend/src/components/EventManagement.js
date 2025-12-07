import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfiles, fetchEvents, setSelectedTimezone } from '../store/eventSlice';
import ProfileSelector from './ProfileSelector';
import EventForm from './EventForm';
import EventList from './EventList';
import Modal from './Modal';
import { timezones } from '../utils/timezones';
import './EventManagement.css';

const EventManagement = () => {
  const dispatch = useDispatch();
  const {
    events,
    selectedTimezone,
    selectedProfileIds
  } = useSelector((state) => state.event);

  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    dispatch(fetchProfiles());
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProfileIds.length > 0) {
      dispatch(fetchEvents(selectedProfileIds));
    } else {
      dispatch(fetchEvents());
    }
  }, [selectedProfileIds, dispatch]);

  const onEditClick = (evt) => {
    setEditingEvent(evt);
  };

  const afterSave = () => {
    setEditingEvent(null);
    if (selectedProfileIds.length > 0) {
      dispatch(fetchEvents(selectedProfileIds));
    } else {
      dispatch(fetchEvents());
    }
  };

  const cancelEdit = () => {
    setEditingEvent(null);
  };

  const closeModal = () => {
    setEditingEvent(null);
  };

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    if (!selectedProfileIds.length) return events;
    
    const ids = new Set(selectedProfileIds);
    return events.filter(evt => 
      evt.profiles.some(p => ids.has(p._id))
    );
  }, [events, selectedProfileIds]);

  return (
    <div className="event-management">
      <div className="event-management-header">
        <div className="header-left">
      <h1>Event Management</h1>
          <p className="subtitle">Create and manage events across multiple timezones.</p>
        </div>
        <div className="header-right">
          <ProfileSelector />
        </div>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <div className="section">
            <h2>Create Event</h2>
              <EventForm
              event={null}
              onClose={cancelEdit}
              onSuccess={afterSave}
              />
          </div>
        </div>

        <div className="right-panel">
          <div className="section">
            <div className="events-header">
              <h2>Events</h2>
              <div className="timezone-selector">
                <label>View in Timezone</label>
                <select
                  value={selectedTimezone}
                  onChange={(e) => dispatch(setSelectedTimezone(e.target.value))}
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <EventList
              events={filteredEvents}
              onEdit={onEditClick}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!editingEvent}
        onClose={closeModal}
        title="Edit Event"
      >
        <EventForm
          event={editingEvent}
          onClose={cancelEdit}
          onSuccess={afterSave}
        />
      </Modal>
    </div>
  );
};

export default EventManagement;

