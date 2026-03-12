import React, { useEffect } from 'react';
import './Popup.css';

function Popup({ isOpen, onClose, title, message, type = 'info' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>
          <i className="ri-close-line"></i>
        </button>
        
        <div className="popup-content">
          <div className="popup-icon">
            <i className="ri-robot-line"></i>
          </div>
          <h3 className="popup-title">{title}</h3>
          <p className="popup-message">{message}</p>
          
          <div className="popup-features">
            <div className="feature-item">
              <i className="ri-check-line"></i>
              <span>ATS Score Analysis</span>
            </div>
            <div className="feature-item">
              <i className="ri-check-line"></i>
              <span>Keyword Optimization</span>
            </div>
            <div className="feature-item">
              <i className="ri-check-line"></i>
              <span>Industry Tips</span>
            </div>
          </div>
          
          <button className="popup-btn" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;