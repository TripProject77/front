import React from 'react';
import './Modal.css'; // 스타일링을 위한 CSS 파일

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {children}
        
      </div>
    </div>
  );
};

export default Modal;