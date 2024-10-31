// src/components/DumpCard/DumpCard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegImage } from 'react-icons/fa';
import './DumpCard.css';

const DumpCard = ({ dump }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dump/${dump.id}`);
  };

  return (
    <div className="dump-card" onClick={handleClick}>
      <div className="cover-photo-container">
        <img
          src={dump.coverPhotoUrl}
          alt={`${dump.title} Cover`}
          className="dump-image"
        />
        <h3 className="dump-title">{dump.title}</h3>
      </div>
      <div className="photo-pane">
        {dump.photos && dump.photos.length > 0 ? (
          <div className="photo-scroll">
            {dump.photos.slice(0, 10).map((photo, index) => (
              <img
                key={index}
                src={photo.photoUrl}
                alt=""
                className="thumbnail"
              />
            ))}
          </div>
        ) : (
          <p className="no-photos">
            <FaRegImage /> No photos yet
          </p>
        )}
      </div>
    </div>
  );
};

export default DumpCard;
