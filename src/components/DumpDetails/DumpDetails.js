// src/components/DumpDetails/DumpDetails.js

import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../firebase/firebaseConfig';
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { FaEllipsisV, FaShareAlt } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './DumpDetails.css';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const DumpDetails = () => {
  const { currentUser } = useContext(AuthContext);
  const { dumpId } = useParams();
  const [dump, setDump] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchDumpDetails = async () => {
      try {
        const dumpDocRef = doc(db, 'dumps', dumpId);
        const dumpDoc = await getDoc(dumpDocRef);
        if (dumpDoc.exists()) {
          const dumpData = dumpDoc.data();
          setDump(dumpData);
          setIsOwner(currentUser && currentUser.uid === dumpData.uid);

          // Listen for real-time updates to photos
          const photosCollectionRef = collection(
            db,
            'dumps',
            dumpId,
            'photos'
          );
          const unsubscribe = onSnapshot(
            photosCollectionRef,
            (snapshot) => {
              const photosData = snapshot.docs.map((doc) => doc.data());
              setPhotos(photosData);
            }
          );

          // Cleanup on unmount
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching dump details:', error);
      }
    };

    fetchDumpDetails();
  }, [dumpId, currentUser]);

  const handleShareDump = () => {
    const dumpUrl = `${window.location.origin}/dump/${dumpId}`;
    if (navigator.share) {
      navigator
        .share({
          title: dump.title,
          url: dumpUrl,
        })
        .then(() => console.log('Dump shared successfully'))
        .catch((error) => console.error('Error sharing dump:', error));
    } else {
      navigator.clipboard.writeText(dumpUrl);
      toast.success('Dump URL copied to clipboard!');
    }
  };

  const handleEditDump = () => {
    // Implement edit functionality
    toast.info('Edit dump functionality coming soon!');
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  if (!dump) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dump-details-container">
      <div className="cover-photo-container">
        <img
          src={dump.coverPhotoUrl}
          alt={`${dump.title} Cover`}
          className="cover-photo"
        />
        <h1 className="dump-title">{dump.title}</h1>
        <button className="more-options-button" title="More Options">
          <FaEllipsisV />
        </button>
        <div className="options-menu">
          {isOwner && <button onClick={handleEditDump}>Edit Dump</button>}
          <button onClick={handleShareDump}>
            <FaShareAlt /> Share Dump
          </button>
        </div>
      </div>
      <div className="photos-grid">
        {photos.map((photo, index) => (
          <img
            key={photo.photoId}
            src={photo.photoUrl}
            alt=""
            className="dump-photo"
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>
      {isLightboxOpen && (
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          slides={photos.map((photo) => ({ src: photo.photoUrl }))}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
};

export default DumpDetails;
