import React from 'react';
import '../styles/modal.css';

const Modal = ({ isOpen, toggleModal, children, closeButtonLabel }) => {
    if (!isOpen) return null;

    return (
        <div id="modal-overlay" className="modal-overlay">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
                <button onClick={toggleModal} className="modal-close-button">{closeButtonLabel}</button>
            </div>
        </div>
    );
};

export default Modal;
