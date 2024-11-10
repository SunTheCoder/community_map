import React, { useEffect, useState } from 'react';
import api from '../api/api';  // Import the custom Axios instance
import { Card, CardHeader, CardBody, CardFooter, Divider, Grid, GridItem, Text, Button, useToast } from '@chakra-ui/react';

const ResourceList = ({ resources, refresh }) => {
    const [localResources, setLocalResources] = useState(resources); // Renamed to `localResources`
    const toast = useToast();

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get('/resources');
                setLocalResources(response.data); // Corrected to `setLocalResources`
            } catch (error) {
                console.error("Error fetching resources:", error);
            }
        };
        
        fetchResources();
    }, [refresh]); // Trigger fetch whenever `refresh` changes

    const handleCopy = async (latitude, longitude) => {
        const formattedCoordinates = `${latitude}, ${longitude}`;
        
        try {
            await navigator.clipboard.writeText(formattedCoordinates);
            toast({
                title: "Copied to clipboard!",
                description: `${formattedCoordinates} has been copied.`,
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Failed to copy",
                description: "Could not copy the coordinates to clipboard.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <div>
            <Grid templateColumns="repeat(5, 1fr)" gap={4} p={4}>
                {localResources.reverse().map(resource => (
                    <GridItem key={resource.id}>
                        <Card m={5}>
                            <CardHeader fontSize={20} fontWeight='bold'>{resource.name}</CardHeader>
                            <CardBody>
                                <Text>Offering: {resource.type}</Text>
                                <Divider/>
                                <Text>City: {resource.city}</Text>
                                <Text>Zip Code: {resource.zip_code}</Text>
                                <Divider/>
                                <Text>Community Verified: {resource.community_verified ? 'Yes' : 'No'}</Text>
                                <Divider/>
                                <Button variant='link' size='sm'>View Details</Button>
                            </CardBody>
                            <CardFooter>
                                <Text 
                                    fontSize={12} 
                                    cursor="pointer" 
                                    onClick={() => handleCopy(resource.latitude, resource.longitude)}
                                >
                                    Latitude: {resource.latitude}, Longitude: {resource.longitude}
                                </Text>
                            </CardFooter>
                        </Card>
                    </GridItem>
                ))}
            </Grid>
        </div>
    );
}

export default ResourceList;
