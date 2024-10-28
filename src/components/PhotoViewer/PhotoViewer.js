// src/components/PhotoViewer/PhotoViewer.js

import React, { useState } from 'react';
import './PhotoViewer.css';

const PhotoViewer = ({ photos, currentIndex, onClose }) => {
    const [index, setIndex] = useState(currentIndex);

    const goNext = () => {
        setIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const goPrev = () => {
        setIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

    return (
        <div className="photo-viewer-overlay" onClick={onClose}>
            <div className="photo-viewer-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={onClose}>&times;</span>
                <img src={photos[index].photoUrl} alt={`Photo ${photos[index].id}`} className="photo-viewer-image" />
                {photos.length > 1 && (
                    <>
                        <button className="prev-button" onClick={goPrev}>&#10094;</button>
                        <button className="next-button" onClick={goNext}>&#10095;</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PhotoViewer;
