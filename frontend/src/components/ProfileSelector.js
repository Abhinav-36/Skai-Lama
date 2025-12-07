import React, { useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProfile, setSelectedProfileIds } from '../store/eventSlice';
import { useClickOutside } from '../hooks/useClickOutside';
import './ProfileSelector.css';

const ProfileSelector = () => {
  const dispatch = useDispatch();
  const { profiles, selectedProfileIds } = useSelector((state) => state.event);
  const [isOpen, setIsOpen] = useState(false);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const currentProfileName = useMemo(() => {
    if (!selectedProfileIds.length) return 'Select current profile...';
    const p = profiles.find(p => p._id === selectedProfileIds[0]);
    return p?.name || 'Select current profile...';
  }, [profiles, selectedProfileIds]);

  useClickOutside(
    dropdownRef,
    () => {
      setIsOpen(false);
      setSearchQuery('');
    },
    [isOpen]
  );

  const toggleProfile = (id) => {
    if (selectedProfileIds.includes(id)) {
      dispatch(setSelectedProfileIds([]));
    } else {
      dispatch(setSelectedProfileIds([id]));
    }
  };

  const addProfile = async (e) => {
    e.preventDefault();
    const name = newProfileName.trim();
    if (!name) return;
    
    try {
      const res = await dispatch(createProfile(name));
      if (createProfile.fulfilled.match(res)) {
        dispatch(setSelectedProfileIds([res.payload._id]));
        setNewProfileName('');
        setShowAddProfile(false);
        setIsOpen(false);
      }
    } catch (err) {
      console.error('Error creating profile:', err);
    }
  };

  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) return profiles;
    const q = searchQuery.toLowerCase();
    return profiles.filter(p => p.name.toLowerCase().includes(q));
  }, [profiles, searchQuery]);

  return (
    <div className="profile-selector-dropdown" ref={dropdownRef}>
          <button
        className="profile-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
          >
        <span>{currentProfileName}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
          </button>

      {isOpen && (
        <div className="profile-selector-dropdown-menu">
          <div className="profile-selector-search">
        <input
          type="text"
              placeholder="Search current profile..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

          <div className="profile-selector-list">
        {filteredProfiles.map(profile => (
              <div
                key={profile._id}
                className={`profile-selector-item ${selectedProfileIds.includes(profile._id) ? 'selected' : ''}`}
                onClick={() => toggleProfile(profile._id)}
              >
                <span className="profile-name">{profile.name}</span>
                {selectedProfileIds.includes(profile._id) && (
                  <span className="checkmark">✓</span>
                )}
              </div>
        ))}
      </div>

          <div className="profile-selector-add">
      {showAddProfile ? (
        <form onSubmit={addProfile} className="add-profile-form">
          <input
            type="text"
                  placeholder="beta"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            autoFocus
            className="profile-name-input"
          />
                <button type="submit" className="add-profile-submit-btn">Add</button>
        </form>
      ) : (
              <div className="add-profile-placeholder">
                <input
                  type="text"
                  placeholder="beta"
                  readOnly
                  onClick={() => setShowAddProfile(true)}
                  className="add-profile-input-placeholder"
                />
        <button
          className="add-profile-btn"
          onClick={() => setShowAddProfile(true)}
        >
                  Add
        </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;


