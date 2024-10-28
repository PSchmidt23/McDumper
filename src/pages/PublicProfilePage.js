// src/pages/PublicProfilePage.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import DumpCard from '../components/DumpCard/DumpCard';
import './ProfilePage.css';

const PublicProfilePage = () => {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [dumps, setDumps] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUserDumps = async () => {
      try {
        const dumpsRef = collection(db, 'dumps');
        const q = query(dumpsRef, where('uid', '==', uid));
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
      }
    };

    fetchUserData();
    fetchUserDumps();
  }, [uid]);

  const handleInstagramClick = () => {
    if (userData.instagram) {
      const instagramUrl = `https://www.instagram.com/${userData.instagram.replace('@', '')}`;
      window.open(instagramUrl, '_blank');
    }
  };

  const groupDumpsByMonth = (dumps) => {
    const grouped = {};
    dumps.forEach((dump) => {
      const date = dump.startDate.toDate();
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(dump);
    });
    return grouped;
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  const groupedDumps = groupDumpsByMonth(dumps);

  return (
    <div className="profile-page-container">
      <div className="profile-info">
        <div className="profile-picture-container">
          {userData.profilePicture ? (
            <img src={userData.profilePicture} alt="Profile" className="profile-picture" />
          ) : (
            <div className="profile-picture-placeholder">No Image</div>
          )}
        </div>
        <h2 className="user-name">
          {userData.firstName || 'N/A'} {userData.lastName || ''}
        </h2>
        {userData.instagram && (
          <div className="instagram-container" onClick={handleInstagramClick}>
            <FaInstagram size={20} />
            <span>{userData.instagram}</span>
          </div>
        )}
      </div>

      <div className="dumps-list">
        {Object.keys(groupedDumps)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((monthYear) => (
            <div key={monthYear} className="dump-month-group">
              <h4 className="month-year-header">{monthYear}</h4>
              {groupedDumps[monthYear].map((dump) => (
                <DumpCard key={dump.id} dump={dump} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PublicProfilePage;
