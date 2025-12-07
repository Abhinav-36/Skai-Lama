import React from 'react';
import EventItem from './EventItem';
import './EventList.css';

const EventList = ({ events, onEdit }) => {
  if (!events || !Array.isArray(events) || events.length === 0) {
    return (
      <div className="event-list empty">
        <p>No events found</p>
      </div>
    );
  }

  return (
    <div className="event-list">
      {events.map(event => (
        <EventItem key={event._id} event={event} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default EventList;






