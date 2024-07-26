import React, { useContext } from 'react';
import { Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext'; // Import your AuthContext

const LogoutScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId'); // Remove any other stored user data if needed

      // Call the logout function from context to reset authentication state
      await logout();

      // Navigate to the login screen or initial screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    // You can trigger the logout function in a button press or any other suitable action
    <Button title="Logout" onPress={handleLogout} />
  );
};

export default LogoutScreen;
