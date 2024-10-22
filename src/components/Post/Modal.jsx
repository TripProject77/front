import React from 'react';
import './Modal.css'; // 스타일링을 위한 CSS 파일

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // 모달이 열리지 않았을 때는 아무것도 렌더링하지 않음

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {children}
        dkdk
      </div>
    </div>
  );
};

export default Modal;