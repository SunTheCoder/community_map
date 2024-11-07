// src/pages/HomePage.jsx
import React, { useState } from 'react';
import AddResourceModal from '../components/Modals/AddResourceModal';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <h1>Welcome to the Community Map</h1>
      <button onClick={openModal}>Add Resource</button>
      
      {/* Render the AddResourceModal and pass isOpen and onClose props */}
      <AddResourceModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default HomePage;
