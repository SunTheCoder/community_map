import { Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Button, Text } from '@chakra-ui/react';



const UserMenu = ({ user, onLogout }) => {
  return (
    <Menu>
      <MenuButton as={Button} variant="unstyled" cursor="pointer">
        <Avatar size='sm' name={user} />
      </MenuButton>
      <MenuList>
      <Text fontSize="lg" fontWeight="bold" textAlign='center'>
                  Welcome, {user}!
                </Text>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuDivider />
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
