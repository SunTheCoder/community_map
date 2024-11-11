// import React, { useState } from 'react';
// import axios from 'axios';
// import { Box, Button, Input, FormControl, FormLabel, Heading, Text, VStack } from '@chakra-ui/react';

// const LoginSignupForm = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLogin, setIsLogin] = useState(true);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const endpoint = isLogin ? '/login' : '/register';
//       const response = await axios.post(endpoint, { username, password });

//       if (isLogin) {
//         console.log("Login successful:", response.data.access_token);
//       } else {
//         console.log(response.data.message);
//       }

//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred");
//     }
//   };

//   return (
//     <Box maxW="sm" mx="auto" p={6} boxShadow="lg" borderRadius="md">
//       <Heading as="h2" size="lg" textAlign="center" mb={4}>
//         {isLogin ? 'Login' : 'Sign Up'}
//       </Heading>
//       <form onSubmit={handleSubmit}>
//         <VStack spacing={4}>
//           <FormControl isRequired>
//             <FormLabel>Username</FormLabel>
//             <Input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Username"
//             />
//           </FormControl>
//           <FormControl isRequired>
//             <FormLabel>Password</FormLabel>
//             <Input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//             />
//           </FormControl>
//           {error && <Text color="red.500">{error}</Text>}
//           <Button type="submit" colorScheme="teal" width="full">
//             {isLogin ? 'Login' : 'Sign Up'}
//           </Button>
//         </VStack>
//       </form>
//       <Button
//         onClick={() => setIsLogin(!isLogin)}
//         mt={4}
//         variant="link"
//         colorScheme="teal"
//         display="block"
//         mx="auto"
//       >
//         {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
//       </Button>
//     </Box>
//   );
// };

// export default LoginSignupForm;


import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Input, FormControl, FormLabel, Heading, Text, VStack } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/authSlice';
import { saveUserData } from '../indexedDB'; // Function to save user data in local storage


const LoginSignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [zipCode, setZipcode] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        console.log('Submitting form:', username, password, zipCode); // Debugging message
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth`, { username, password, zipCode });
      console.log(response.data.message); // Success message for login or signup
      console.log('User:', response.data); // User data
    //   const { token, user, message } = response.data;
      const token = response.data.access_token; // Token for authenticated requests
      const user = response.data.username; // User data
      const is_admin = response.data.is_admin; // Whether the user is an admin or not

      const indexData = {  username: user, is_admin: is_admin }

      await saveUserData(indexData);
      console.log('Token:', token); // Token for authenticated requests
      dispatch(setCredentials({ token, user, isAdmin: is_admin })); // Store user credentials in Redux store
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Box maxW="sm" mx="auto" p={6} boxShadow="lg" borderRadius="md">
      <Heading as="h2" size="lg" textAlign="center" mb={4}>
        Welcome
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="CommUnityMama"
              _placeholder={{ fontStyle: "italic"}}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nolove4fascists"
              _placeholder={{ fontStyle: "italic"}}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>ZIP Code</FormLabel>
            <Input
              type="zipcode"
              value={zipCode}
              onChange={(e) => setZipcode(e.target.value)}
              placeholder="21133"
              _placeholder={{ fontStyle: "italic"}}
            />
          </FormControl>
          {error && <Text color="red.500">{error}</Text>}
          <Button type="submit" colorScheme="teal" width="full">
            Continue
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default LoginSignupForm;
