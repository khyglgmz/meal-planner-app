import React, { createContext, useState, useEffect, Alert } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../services/axiosConfig';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteMeals, setFavoriteMeals] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          const parsedUserId = parseInt(storedUserId, 10);
          setUserId(parsedUserId);
          fetchUserFavorites(parsedUserId);
        } else {
          console.warn('No userId found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching userId from AsyncStorage:', error);
      }
    };

    fetchData();
  }, []);

  const fetchUserFavorites = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        return;
      }

      const response = await axiosInstance.get(`/favorites/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        const favoriteMealIds = response.data.map(favorite => favorite.mealId);

        const mealDetailsPromises = favoriteMealIds.map(async mealId => {
          const mealResponse = await axiosInstance.get(`/meal/get/${mealId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return mealResponse.data;
        });

        const mealDetails = await Promise.all(mealDetailsPromises);
        setFavoriteMeals(mealDetails);
      } else {
        console.error('Invalid response format for user favorites:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user favorites:', error.response ? error.response.data : error.message);
    }
  };

  const addFavorite = async (userId, mealId) => {
    try {
      await axiosInstance.post('/favorites/add', { userId, mealId });
      await fetchUserFavorites(userId); // Refresh the favorites list
      Alert.alert('Success', 'Meal added to favorites!');
    } catch (error) {
      console.error('Error adding favorite:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to add meal to favorites.');
    }
  };

  const removeFavorite = async (userFavoriteID) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return;
    }

    console.log('Current favorite meals before removal:', favoriteMeals);

    // Make DELETE request to remove favorite
    await axiosInstance.delete(`/favorites/remove/${userFavoriteID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Remove the meal locally
    setFavoriteMeals(prevMeals => {
      const updatedMeals = prevMeals.filter(meal => meal.userFavoriteID !== userFavoriteID);
      console.log('Updated favorite meals after removal:', updatedMeals);
      return updatedMeals;
    });

    // Optionally, refresh favorites after successful removal
    await fetchUserFavorites(userId);

    Alert.alert('Success', 'Meal removed from favorites!');
  } catch (error) {
    console.error('Error removing favorite:', error.response ? error.response.data : error.message);
    Alert.alert('Error', 'Failed to remove meal from favorites.');
  }
};

  return (
    <FavoritesContext.Provider
      value={{ favoriteMeals, fetchUserFavorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
