import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent, updateEvent } from '../store/eventSlice';
import { timezones } from '../utils/timezones';
import { getDateTimeInputValue, combineDateTime } from '../utils/dateUtils';
import { useClickOutside } from '../hooks/useClickOutside';
import './EventForm.css';

const EventForm = ({ event, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { profiles, selectedTimezone } = useSelector((state) => state.event);
  
  const [formData, setFormData] = useState({
    selectedProfiles: event?.profiles?.map(p => p._id) || [],
    timezone: event?.timezone || selectedTimezone,
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '00:00'
  });
  const [errors, setErrors] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (event) {
      const start = getDateTimeInputValue(event.startDateTime, event.timezone);
      const end = getDateTimeInputValue(event.endDateTime, event.timezone);
      setFormData({
        selectedProfiles: Array.isArray(event.profiles) ? event.profiles.map(p => p._id) : [],
        timezone: event.timezone,
        startDate: start.date,
        startTime: start.time || '00:00',
        endDate: end.date,
        endTime: end.time || '00:00'
      });
      initialized.current = true;
    } else {
      if (!initialized.current) {
        setFormData({
          selectedProfiles: [],
          timezone: selectedTimezone,
          startDate: '',
          startTime: '00:00',
          endDate: '',
          endTime: '00:00'
        });
        initialized.current = true;
      } else {
        setFormData(prev => ({
          selectedProfiles: [],
          timezone: prev.timezone,
          startDate: '',
          startTime: '00:00',
          endDate: '',
          endTime: '00:00'
        }));
      }
      setErrors({});
      setShowDropdown(false);
      setSearchText('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  useClickOutside(
    dropdownRef,
    () => {
      setShowDropdown(false);
      setSearchText('');
    },
    [showDropdown]
  );

  const toggleProfile = (id) => {
    setFormData(prev => {
      const current = prev.selectedProfiles;
      if (current.includes(id)) {
        return { ...prev, selectedProfiles: current.filter(p => p !== id) };
      }
      return { ...prev, selectedProfiles: [...current, id] };
    });
  };

  const filteredProfiles = useMemo(() => {
    if (!Array.isArray(profiles)) return [];
    if (!searchText.trim()) return profiles;
    const q = searchText.toLowerCase();
    return profiles.filter(p => p.name.toLowerCase().includes(q));
  }, [profiles, searchText]);

  const onChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.selectedProfiles.length === 0) {
      newErrors.profiles = 'Select at least one profile';
    }

    if (!formData.startDate || !formData.startTime) {
      newErrors.startDateTime = 'Start date and time are required';
    }

    if (!formData.endDate || !formData.endTime) {
      newErrors.endDateTime = 'End date and time are required';
    }

    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const start = combineDateTime(
        formData.startDate,
        formData.startTime,
        formData.timezone
      );
      const end = combineDateTime(
        formData.endDate,
        formData.endTime,
        formData.timezone
      );

      if (end <= start) {
        newErrors.endDateTime = 'End date/time must be after start date/time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const startDateTime = combineDateTime(
        formData.startDate,
        formData.startTime,
        formData.timezone
      );
      const endDateTime = combineDateTime(
        formData.endDate,
        formData.endTime,
        formData.timezone
      );

      const eventData = {
        profiles: formData.selectedProfiles,
        timezone: formData.timezone,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString()
      };

      if (event) {
        const result = await dispatch(updateEvent({ eventId: event._id, eventData }));
        if (updateEvent.rejected.match(result)) {
          setErrors({ submit: result.payload || 'Failed to update event' });
          return;
        }
      } else {
        const result = await dispatch(createEvent(eventData));
        if (createEvent.rejected.match(result)) {
          setErrors({ submit: result.payload || 'Failed to create event' });
          return;
        }
        setFormData(prev => ({
          selectedProfiles: [],
          timezone: prev.timezone,
          startDate: '',
          startTime: '00:00',
          endDate: '',
          endTime: '00:00'
        }));
        setErrors({});
      }

      onSuccess();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save event' });
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Profiles</label>
        <div className="profile-selection-wrapper" ref={dropdownRef}>
          <div 
            className="profile-selection"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {formData.selectedProfiles.length > 0 ? (
              <span className="profile-count-text">
                {formData.selectedProfiles.length} profile{formData.selectedProfiles.length > 1 ? 's' : ''} selected
              </span>
            ) : (
              <span className="placeholder">Select profiles...</span>
            )}
            <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
          </div>
          {showDropdown && (
            <div className="profile-dropdown-menu">
              <div className="profile-search">
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="search-input"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="profile-checkboxes">
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map(profile => (
                    <label key={profile._id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.selectedProfiles.includes(profile._id)}
                        onChange={() => toggleProfile(profile._id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span>{profile.name}</span>
                    </label>
                  ))
                ) : (
                  <div className="no-profiles">No profiles found</div>
                )}
              </div>
            </div>
          )}
        </div>
        {errors.profiles && <span className="error">{errors.profiles}</span>}
      </div>

      <div className="form-group">
        <label>Timezone</label>
        <select
          value={formData.timezone}
          onChange={(e) => onChange('timezone', e.target.value)}
        >
          {timezones.map(tz => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Start Date & Time</label>
        <div className="datetime-inputs">
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
            className={errors.startDateTime ? 'error-input' : ''}
          />
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => onChange('startTime', e.target.value)}
            className={errors.startDateTime ? 'error-input' : ''}
          />
        </div>
        {errors.startDateTime && <span className="error">{errors.startDateTime}</span>}
      </div>

      <div className="form-group">
        <label>End Date & Time</label>
        <div className="datetime-inputs">
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
            className={errors.endDateTime ? 'error-input' : ''}
          />
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => onChange('endTime', e.target.value)}
            className={errors.endDateTime ? 'error-input' : ''}
          />
        </div>
        {errors.endDateTime && <span className="error">{errors.endDateTime}</span>}
      </div>

      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-actions">
        {event && (
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        )}
        <button type="submit" className="submit-btn">
          {event ? 'Update Event' : '+ Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;

