import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard'; 
import IconButton from './IconButton';
import '../styles/tabs.css';
import addTransactionIcon from '../icons/money-transfer.png';
import addMemberIcon from '../icons/add-user.png';
import Modal from './Modal';
import { createTransaction, listUsers } from './ApiService';


function Tabs() {
    const [activeTab, setActiveTab] = useState('personal');
    const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
    const [isMemberModalOpen, setMemberModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const categories = [
        { name: "Food", color: "#4CAF50" },
        { name: "Clothing", color: "#2196F3" },
        { name: "Transport", color: "#FFEB3B" },
        { name: "Housing", color: "#795548" },
        { name: "Healthcare", color: "#F44336" },
        { name: "Education", color: "#9C27B0" },
        { name: "Communications", color: "#00BCD4" },
        { name: "Entertainment", color: "#E91E63" },
        { name: "Investments", color: "#607D8B" },
        { name: "Charity", color: "#FFC107" }
    ];

    const handleUserSelection = (event) => {
        setSelectedUserId(event.target.value);
    };

    const handleAddUser = () => {
        if (selectedUserId) {
            const userToAdd = allUsers.find(user => user.id === selectedUserId);
            if (userToAdd && !users.some(user => user.id === selectedUserId)) {
                setUsers(prevUsers => [...prevUsers, userToAdd]);
                setSelectedUserId(null); 
                setRefreshTrigger(prev => prev + 1);
            }
        }
    };
    
    const handleRemoveUser = () => {
        if (selectedUserId) {
            setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUserId));
            setSelectedUserId(null);
            setRefreshTrigger(prev => prev + 1);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await listUsers();
                setAllUsers(fetchedUsers);
                const specificUser = fetchedUsers.filter(user => user.id === "ffd807fe3eb4657d9404e4a6c05bb8d4");
                setUsers(specificUser);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
    
        fetchUsers();
    }, []);

    const addTransaction = () => {
        setShowForm(true);
    };

    const toggleTransactionModal = () => {
        setTransactionModalOpen(!isTransactionModalOpen);
    };

    const toggleMemberModal = () => {
        setMemberModalOpen(!isMemberModalOpen);
    };
    

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const { date, category, amount } = event.target.elements;
        const formattedDate = new Date(date.value).toISOString().slice(0, 10) + " 00:00:00";        

        const transactionData = {
            date: formattedDate,
            amount: Number(amount.value),
            category: category.value,
            userId: "ffd807fe3eb4657d9404e4a6c05bb8d4"
        };
    
        try {

            await createTransaction(transactionData);
            console.log("Transaction submitted successfully:", transactionData);
            console.log("not interable")
            setRefreshTrigger(prev => prev + 1);
            toggleTransactionModal(); 
        } catch (error) {
            console.error("Failed to submit transaction:", error);
        }
    };

    const transactionForm = (
        <form onSubmit={handleFormSubmit}>
            <div className="settings-section">
                <div className="settings-label">Date:</div>
                <input
                    type="date"
                    name="date"
                    className="budget-input"
                    required
                />
            </div>
            <div className="settings-section">
                <div className="settings-label">Amount:</div>
                <input
                    type="number"
                    name="amount"
                    className="budget-input"
                    required
                />
            </div>
            <div className="settings-section">
                <div className="settings-label">Category:</div>
                <select
                    name="category"
                    className="budget-input"
                    required
                >
                    {categories.map(category => (
                        <option key={category.name} value={category.name}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div className="button-group">
                <button className="set-budget-button" type="submit">Submit</button>
            </div>
        </form>
    );

    const userManagementForm = (
        <div className="user-management-section">
            <h2>Current Users</h2>
            <div className="user-list-container">
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            </div>
            <select onChange={handleUserSelection} value={selectedUserId || ""} className="user-selection-dropdown">
                <option value="">Select a user...</option>
                {allUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            <div className="button-group">
                <button onClick={handleAddUser} className="set-budget-button">Add</button>
                <button onClick={() => handleRemoveUser(selectedUserId)} className="remove-budget-button">Remove</button>
            </div>
        </div>
    );

    return (
        <div>
            <div className="tabs">
                <button
                    className={activeTab === 'personal' ? 'active' : ''}
                    onClick={() => setActiveTab('personal')}
                >
                    PERSONAL
                </button>
                <button
                    className={activeTab === 'family' ? 'active' : ''}
                    onClick={() => setActiveTab('family')}
                >
                    FAMILY
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'personal' && (
                    <div>
                        <div className='addTransactionButtonContainer'>
                            <IconButton imageUrl={addTransactionIcon} alt="Budget" onClick={toggleTransactionModal} />
                            <Modal isOpen={isTransactionModalOpen} toggleModal={toggleTransactionModal} closeButtonLabel="Close">
                                {transactionForm}
                            </Modal>
                        </div>
                        <div className="dashboard-container">
                            {categories.map((category) => (
                                <Dashboard key={category.name} category={category.name} color={category.color} refreshTrigger={refreshTrigger} users={["ffd807fe3eb4657d9404e4a6c05bb8d4"]}/>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'family' && (
                    <div>
                        <div className='addTransactionButtonContainer'>
                            <IconButton imageUrl={addMemberIcon} alt="Add Member" onClick={toggleMemberModal} />
                            <Modal isOpen={isMemberModalOpen} toggleModal={toggleMemberModal} closeButtonLabel="Close">
                                {userManagementForm}
                            </Modal>
                        </div>
                        <div className="dashboard-container">
                            {categories.map((category) => (
                                <Dashboard key={category.name} category={category.name} color={category.color} refreshTrigger={refreshTrigger} users={users.map(user => user.id)}/>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
        
    );

    
}

export default Tabs;