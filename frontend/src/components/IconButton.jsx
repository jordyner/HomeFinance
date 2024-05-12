import React from 'react';
import '../styles/iconButton.css';

const IconButton = ({ imageUrl, alt, onClick }) => {
    return (
        <button className="button" onClick={onClick}>
            <img src={imageUrl} alt={alt} className="image" />
        </button>
    );
};

export default IconButton;