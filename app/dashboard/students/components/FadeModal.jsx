'use client';

import React, { useEffect } from 'react';

const FadeModal = ({ show, onClose = () => {}, children, large }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`fade-modal ${large ? 'large-modal' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .fade-modal {
          background: white;
          border-radius: 12px;
          padding: 10px;
          max-width: 80%;
          width: 900px;
          height: 500px;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          margin-right: 20px;
        }

        .large-modal {
          width: 80%;
        }

        .close-button {
          font-size: 24px;
          cursor: pointer;
          position: absolute;
          top: 10px;
          right: 15px;
          color: gray;
        }

        @media (max-width: 600px) {
          .fade-modal {
            width: 95%;
          }

          .close-button {
            font-size: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default FadeModal;
