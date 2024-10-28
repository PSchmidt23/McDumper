// src/components/CreateDumpForm/CreateDumpForm.js

import React, { useState, useContext } from 'react';
import { db, storage } from '../../firebase/firebaseConfig';
import { AuthContext } from '../../contexts/AuthContext';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './CreateDumpForm.css';
import { toast } from 'react-toastify';

const CreateDumpForm = ({ onClose }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(''); // Reintroduce startDate
  const [endDate, setEndDate] = useState(''); // Reintroduce endDate
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !startDate || !endDate || !coverPhoto) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!currentUser) {
      toast.error('You must be logged in to create a dump.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the dump document
      const dumpRef = doc(collection(db, 'dumps'));
      const dumpId = dumpRef.id;

      const dumpData = {
        dumpId: dumpId,
        uid: currentUser.uid,
        title: title,
        startDate: new Date(startDate), // Include startDate
        endDate: new Date(endDate), // Include endDate
        coverPhotoUrl: '', // Placeholder, update later
        createdAt: serverTimestamp(),
      };

      await setDoc(dumpRef, dumpData);

      // Navigate to the dump page immediately
      navigate(`/dump/${dumpId}`);

      // Upload cover photo
      const timestamp = Date.now();
      const coverPhotoRef = ref(
        storage,
        `dumpPhotos/${currentUser.uid}/${dumpId}/cover_${timestamp}_${coverPhoto.name}`
      );

      const coverUploadTask = uploadBytesResumable(
        coverPhotoRef,
        coverPhoto
      );

      coverUploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({
            ...prev,
            coverPhoto: progress,
          }));
        },
        (error) => {
          console.error('Cover photo upload error:', error);
        },
        async () => {
          const coverPhotoUrl = await getDownloadURL(
            coverUploadTask.snapshot.ref
          );
          // Update the dump document with cover photo URL
          await updateDoc(dumpRef, { coverPhotoUrl: coverPhotoUrl });
        }
      );

      // Upload additional photos asynchronously
      photos.forEach((photo) => {
        const uniquePhotoName = `photo_${timestamp}_${photo.name}`;
        const photoRef = ref(
          storage,
          `dumpPhotos/${currentUser.uid}/${dumpId}/${uniquePhotoName}`
        );
        const uploadTask = uploadBytesResumable(photoRef, photo);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prev) => ({
              ...prev,
              [photo.name]: progress,
            }));
          },
          (error) => {
            console.error('Photo upload error:', error);
          },
          async () => {
            const photoUrl = await getDownloadURL(
              uploadTask.snapshot.ref
            );

            // Add photo document to Firestore
            const photoDocRef = doc(
              collection(db, 'dumps', dumpId, 'photos')
            );
            await setDoc(photoDocRef, {
              photoId: photoDocRef.id,
              photoUrl: photoUrl,
              uid: currentUser.uid,
              createdAt: serverTimestamp(),
            });
          }
        );
      });

      setIsSubmitting(false);
      onClose(); // Close the modal if needed
    } catch (error) {
      console.error('Error creating dump:', error);
      toast.error('Failed to create dump. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-dump-modal">
      <div className="create-dump-form-container">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Create New Dump</h2>
        <form onSubmit={handleSubmit} className="create-dump-form">
          <label>
            Title<span className="required">*</span>:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Start Date<span className="required">*</span>:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label>
            End Date<span className="required">*</span>:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
          <label>
            Cover Photo<span className="required">*</span>:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverPhoto(e.target.files[0])}
              required
            />
          </label>
          <label>
            Additional Photos:
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setPhotos(Array.from(e.target.files))}
            />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Dump'}
          </button>
        </form>
        {isSubmitting && (
          <div className="upload-progress">
            <p>Uploading photos...</p>
            {Object.keys(uploadProgress).map((fileName) => (
              <div key={fileName}>
                {fileName}: {Math.round(uploadProgress[fileName])}%
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDumpForm;
