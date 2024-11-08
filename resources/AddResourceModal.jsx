import React, { useState } from 'react';

const AddResourceModal = ({ isOpen, onClose, onSave }) => {
  const [resourceData, setResourceData] = useState({
    name: '',
    location: '',
    type: '',
    accessibility: '',
    comments: '',
    description: '',
    votes_accuracy: 0,
    votes_verified: 0,
    latitude: '',
    longitude: '',

    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
  });

  const handleChange = (e) => {
    setResourceData({ ...resourceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(resourceData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
          <input type="text" name="type" placeholder="Type" onChange={handleChange} required />
          <input type="text" name="accessibility" placeholder="Accessibility" onChange={handleChange} />
          <input type="text" name="comments" placeholder="Comments" onChange={handleChange} />
          <input type="text" name="description" placeholder="Description" onChange={handleChange} />
          <input type="text" name="longitude" placeholder="Longitude" onChange={handleChange} />
          <input type="text" name="latitude" placeholder="Latitude" onChange={handleChange} />
          <input type="text" name="street_address" placeholder="Street Address" onChange={handleChange} />
          <input type="text" name="city" placeholder="City" onChange={handleChange} />
          <input type="text" name="state" placeholder="State" onChange={handleChange} />
          <input type="text" name="zip_code" placeholder="Zip Code" onChange={handleChange} required />
          <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} />
          <button type="submit">Save Resource</button>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;
