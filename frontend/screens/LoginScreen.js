// screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, Image } from 'react-native';
import axiosInstance from '../services/axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoImage from '../assets/logo.png'; // Adjust the path as per your actual project structure


const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, userId } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/login', { username, password });

      const { token, userId } = response.data;

      if (token && userId) {
        console.log('Received token:', token);
        await login(token, userId);
      } else {
        Alert.alert('Login Failed', 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Error during login:', error); // Log detailed error
      Alert.alert('Login Failed', 'An error occurred during login.');
    }
  };
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <View style={{ alignItems: 'center' }}>
        <Image
          style={{ width: 150, height: 150, margin: 20 }}
          source={LogoImage}
          resizeMode="contain"
        />
      </View>
      <TextInput
        style={{ borderWidth: 1, borderRadius: 4, padding: 10, marginBottom: 12, borderColor: '#4CAF50' }}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={{ borderWidth: 1, borderRadius: 4, padding: 10, marginBottom: 12, borderColor: '#4CAF50' }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" color="#FFA07A"  onPress={handleLogin} />
      <Button
        title="Not a member? Register"
        onPress={() => navigation.navigate('Register')}
        color="#FFA07A" 
        style={{
          backgroundColor: '#FFA07A',
          padding: 10,
          marginBottom: 12
        }}
      />
    </View>
  );
};


export default LoginScreen;
