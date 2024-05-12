import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Tabs from './Tabs';
import IconButton from './IconButton';
import Modal from './Modal';
import userIcon from '../icons/user.png';
import '../styles/upperBar.css';

function App() {
    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => setModalOpen(!isModalOpen);

    return (
        <Router>
            <div className="header-container">
                <h1>HomeFinance</h1>
                        <IconButton imageUrl={userIcon} alt="User Profile" onClick={toggleModal} />
                        <Modal isOpen={isModalOpen} toggleModal={toggleModal} closeButtonLabel="Close">
                            <div className='user-info-modal'>
                                <h3>User Information</h3>
                                <p><b>Name:</b> Jirka</p>
                                <p><b>Email:</b> jiri.jordan@firma.seznam.cz</p>
                            </div>
                        </Modal>
                </div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/overview" element={<Tabs />} />
                </Routes>
        </Router>
    );
}

export default App;
