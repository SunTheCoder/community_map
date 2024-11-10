import React, { useEffect, useState } from 'react';
import api from '../api/api';  // Import the custom Axios instance
import { Card, CardHeader, CardBody, CardFooter, Divider, Grid, GridItem, Text, Button, useToast, Heading, Flex } from '@chakra-ui/react';

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
                {localResources.map(resource => (
                    <GridItem key={resource.id}>
                        <Card m={5} w={270}>
                            <CardHeader fontSize={20} fontWeight='bold'>
                            <Heading size="md" fontWeight="bold">{resource.name}</Heading> 

                            </CardHeader>
                            <CardBody>
                                <Text fontSize="lg" >Offering:</Text>
                                <Text fontSize="lg" textAlign='right'>{resource.type}</Text>
                                <Divider/>
                                <Flex justifyContent="space-between" fontSize="sm" >
                                    <Text>City:</Text>
                                    <Text>{resource.city}</Text>
                                </Flex>
                                
                                <Flex justifyContent="space-between" fontSize="sm" >
                                    <Text>ZIP Code:</Text>
                                    <Text>{resource.zip_code}</Text>
                                </Flex>
                                <Divider/>
                                <Flex justifyContent="space-between" fontSize="sm" >
                                    <Text>Community Verified:</Text>
                                    <Text>{resource.community_verified ? 'Yes' : 'No'}</Text>
                                </Flex>
                                <Divider/>
                                <Button variant='link' size='sm'>View Details</Button>
                            </CardBody>
                            <CardFooter>
                                <Text 
                                    fontSize={12} 
                                    cursor="pointer" 
                                    onClick={() => handleCopy(resource.latitude, resource.longitude)}
                                >
                                    Latitude: {resource.latitude} <br></br> Longitude: {resource.longitude}
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
