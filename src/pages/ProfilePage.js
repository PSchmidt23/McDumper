// src/pages/ProfilePage.js

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaInstagram, FaShareAlt, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DumpCard from '../components/DumpCard/DumpCard';
import CreateDumpForm from '../components/CreateDumpForm/CreateDumpForm';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dumps, setDumps] = useState([]);
  const [isCreateDumpOpen, setIsCreateDumpOpen] = useState(false);

  const fetchUserDumps = useCallback(async () => {
    if (!currentUser || !currentUser.uid) {
      console.error('No authenticated user found.');
      return;
    }

    try {
      const dumpsRef = collection(db, 'dumps');
      const q = query(dumpsRef, where('uid', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);

      const dumpsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const dump = { id: doc.id, ...doc.data() };

          // Fetch photos for the dump
          const photosRef = collection(db, 'dumps', doc.id, 'photos');
          const photosSnapshot = await getDocs(photosRef);
          dump.photos = photosSnapshot.docs.map((photoDoc) => photoDoc.data());

          return dump;
        })
      );

      setDumps(dumpsData);
    } catch (error) {
      console.error('Error fetching dumps:', error);
      if (
        error.code === 'permission-denied' ||
        error.code === 'firestore/permission-denied'
      ) {
        toast.error('You do not have permission to view these dumps.');
      } else {
        toast.error('Failed to load your dumps.');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchUserDumps();
    }
  }, [currentUser, fetchUserDumps]);

  const openCreateDumpForm = () => {
    setIsCreateDumpOpen(true);
  };

  const closeCreateDumpForm = () => {
    setIsCreateDumpOpen(false);
    fetchUserDumps();
  };

  const openSettings = () => {
    navigate('/settings');
  };

  const handleInstagramClick = () => {
    if (currentUser.instagram) {
      const instagramUrl = `https://www.instagram.com/${currentUser.instagram.replace(
        '@',
        ''
      )}`;
      window.open(instagramUrl, '_blank');
    }
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/user/${currentUser.uid}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${currentUser.firstName} ${currentUser.lastName}'s Profile`,
          url: profileUrl,
        })
        .then(() => console.log('Profile shared successfully'))
        .catch((error) => console.error('Error sharing profile:', error));
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast.success('Profile URL copied to clipboard!');
    }
  };

  const groupDumpsByMonth = (dumps) => {
    const grouped = {};
    dumps.forEach((dump) => {
      let date = null;

      // Check if startDate exists and has toDate method
      if (dump.startDate && dump.startDate.toDate) {
        date = dump.startDate.toDate();
      } else if (dump.createdAt && dump.createdAt.toDate) {
        // Fallback to createdAt if startDate is not available
        date = dump.createdAt.toDate();
      } else {
        console.warn(
          `Dump ${dump.id} is missing 'startDate' and 'createdAt' fields.`
        );
        return; // Skip this dump or handle accordingly
      }

      const monthYear = date.toLocaleString('default', {
        month: 'short',
        year: '2-digit',
      });

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(dump);
    });
    return grouped;
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  const groupedDumps = groupDumpsByMonth(dumps);

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <button
          onClick={openSettings}
          className="settings-button"
          title="Settings"
        >
          <FaCog />
        </button>
      </div>
      <div className="profile-info">
        {currentUser.profilePicture ? (
          <img
            src={currentUser.profilePicture}
            alt="Profile"
            className="profile-picture"
          />
        ) : (
          <div className="profile-picture-placeholder">No Image</div>
        )}
        <p className="user-name">
          {currentUser.firstName} {currentUser.lastName}
        </p>
        <p onClick={handleInstagramClick} className="instagram-handle">
          <FaInstagram /> {currentUser.instagram || 'N/A'}
        </p>
        <button
          onClick={handleShareProfile}
          className="share-profile-button"
        >
          <FaShareAlt /> Share Profile
        </button>
      </div>

      <div className="dumps-header">
        <h3>Dumps</h3>
        <button
          onClick={openCreateDumpForm}
          className="add-dump-button"
          title="Add Dump"
        >
          <FaPlus />
        </button>
      </div>
      <hr className="divider" />

      <div className="dumps-list">
        {Object.keys(groupedDumps)
          .sort((a, b) => new Date(b) - new Date(a)) // Sort by date descending
          .map((monthYear) => (
            <div key={monthYear} className="dump-month-group">
              <h4 className="month-year-header">{monthYear}</h4>
              {groupedDumps[monthYear].map((dump) => (
                <DumpCard key={dump.id} dump={dump} />
              ))}
            </div>
          ))}
      </div>

      {isCreateDumpOpen && <CreateDumpForm onClose={closeCreateDumpForm} />}
    </div>
  );
};

export default ProfilePage;
