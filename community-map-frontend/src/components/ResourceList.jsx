import React, { useEffect, useState } from 'react';
import api from '../api/api';  // Import the custom Axios instance
import { Card, CardHeader, CardBody, CardFooter, Divider, Grid, GridItem, Text } from '@chakra-ui/react'
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
            <Grid templateColumns="repeat(4, 1fr)" gap={6} p={4}>
            {/* <h2>Resource List</h2> */}
            {resources.reverse().map(resource => (
                console.log('Resource:', resource),  // Log the resource for debugging purposes
                // <div key={resource.id}>
                //     <h3>{resource.name}</h3>
                //     <h4>{resource.type}</h4>
                //     <p>{resource.zip_code}</p>
                //     Community Verified: {resource.community_verified ? 'Yes' : 'No'}
                // </div>
                <GridItem>
                <Card key={resource.id} m={5}>
                    <CardHeader fontSize={20} fontWeight='bold' >{resource.name}</CardHeader>
                    <CardBody>
                        <Text>Offering: {resource.type}</Text>
                        <Divider/>
                        <Text>Street Address: {resource.street_address}</Text>
                        <Text>City: {resource.city}</Text>
                        <Text>State: {resource.state}</Text>
                        <Text>Zip Code: {resource.zip_code}</Text>
                        <Divider/>
                        <Text>Community Verified: {resource.community_verified ? 'Yes' : 'No'}</Text>
                        <Divider/>
                    </CardBody>
                    <CardFooter>Phone Number: {resource.phone_number}</CardFooter>  
                </Card>
                </GridItem>
            ))}
            </Grid>
        </div>
    );
}

export default ResourceList;