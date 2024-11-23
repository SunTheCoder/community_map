import React from "react";

// const ViewResourceModal = ({ isOpen, onClose, resource }) => {
//     const { name, type, city, zip_code, community_verified, latitude, longitude } = resource;

// }
const ViewResourceModal = ({ resource }) => {
    if (!resource) return null;

    const { name, type, city, zip_code, community_verified, latitude, longitude } = resource;

   

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{name}</h2>
                <p>Type: {type}</p>
                <p>City: {city}</p>
                <p>Zip Code: {zip_code}</p>
                <p>Community Verified: {community_verified ? 'Yes' : 'No'}</p>
                <p>Latitude: {latitude}</p>
                <p>Longitude: {longitude}</p>
                <button onClick={onResourceModalClose}>Close</button>
            </div>
        </div>
    );
};

export default ViewResourceModal;