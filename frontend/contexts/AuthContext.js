import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        if (token && storedUserId) {
          setIsAuthenticated(true);
          setUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      }
    };
    loadAuthData();
  }, []);
  
  const login = async (token, userId) => {
    try {
      if (token && userId !== null && userId !== undefined) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', userId.toString());
        setIsAuthenticated(true);
        setUserId(userId);
        navigation.navigate('Home');
      } else {
        console.error('Token or userId is invalid');
      }
    } catch (error) {
      console.error('Error storing authentication data:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      setIsAuthenticated(false);
      setUserId(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error removing authentication data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
