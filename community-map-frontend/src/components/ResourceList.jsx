import React, { useEffect, useState } from 'react';
import api from '../api/api';  // Import the custom Axios instance
// import './ResourceList.css';  // Import the CSS file for styling

const ResourceList = () => {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        // Fetch resources from the API when the component mounts
        api.get('/resources')
           .then(response => setResources(response.data))
           .catch(error => console.error(error));
    }, []);

    console.log('Resources:', resources);
    return (
        <div>
            {/* <h2>Resource List</h2> */}
            {resources.map(resource => (
                console.log('Resource:', resource),  // Log the resource for debugging purposes
                <div key={resource.id}>
                    <h3>{resource.name}</h3>
                    <h4>{resource.type}</h4>
                    <p>{resource.zip_code}</p>
                </div>
            ))}
        </div>
    );
}

export default ResourceList;