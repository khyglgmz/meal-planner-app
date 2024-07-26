import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SearchBar, Button, Icon, Card, Image } from 'react-native-elements';
import axiosInstance from '../services/axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import { FavoritesContext } from '../contexts/FavoritesContext';

export default function MainScreen({ navigation }) {
  const { userId } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const { favoriteMeals, fetchUserFavorites, addFavorite, removeFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    fetchCategories();
    fetchMeals();
    fetchUserFavorites(userId);
  }, []);

  useEffect(() => {
    filterMeals();
  }, [search, meals, favoriteMeals]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/meal/get');
      if (Array.isArray(response.data)) {
        const uniqueCategories = [
          ...new Set(response.data.map((meal) => meal.mealCategory)),
        ];
        setCategories(uniqueCategories);
      } else {
        console.error('Invalid response format for categories:', response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMeals = async () => {
    try {
      const response = await axiosInstance.get('/meal/get');
      if (Array.isArray(response.data)) {
        setMeals(response.data);
        setFilteredMeals(response.data);
      } else {
        console.error('Invalid response format for meals:', response.data);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const filterMeals = () => {
    if (search) {
      const filtered = meals.filter(
        (meal) =>
          meal.mealName.toLowerCase().includes(search.toLowerCase()) ||
          meal.mealDescription.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMeals(filtered);
    } else {
      setFilteredMeals(meals);
    }
  };

  const filterByCategory = (category) => {
    if (category === 'All') {
      setFilteredMeals(meals);
    } else {
      const filtered = meals.filter((meal) => meal.mealCategory === category);
      setFilteredMeals(filtered);
    }
  };

  const renderCategoryButtons = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
    >
      <Button
        key="All"
        title="All"
        buttonStyle={{
          backgroundColor: '#FFA07A',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 15,
          marginHorizontal: 3,
        }}
        titleStyle={{ fontSize: 14 }}
        onPress={() => filterByCategory('All')}
      />
      {categories.map((category) => (
        <Button
          key={category}
          title={category}
          buttonStyle={{
            backgroundColor: '#FFA07A',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 15,
            marginHorizontal: 3,
          }}
          titleStyle={{ fontSize: 14 }}
          onPress={() => filterByCategory(category)}
        />
      ))}
    </ScrollView>
  );

  const navigateToMealDetails = (meal) => {
    navigation.navigate('MealDetails', { meal });
  };

 
  const handleFavoriteToggle = async (mealId) => {
    const existingFavorite = favoriteMeals.find((meal) => meal.mealId === mealId);

    if (existingFavorite) {
      await removeFavorite(existingFavorite.userFavoriteID);
    } else {
      await addFavorite(userId, mealId);
    }

    fetchUserFavorites(userId);
  };

  const renderFavoriteButton = (mealId) => {
    const isFavorite = favoriteMeals.some((meal) => meal.mealId === mealId);
    return (
      <TouchableOpacity onPress={() => handleFavoriteToggle(mealId)}>
        <Icon name={isFavorite ? 'heart' : 'heart-o'} type="font-awesome" color={isFavorite ? 'red' : 'black'} />
      </TouchableOpacity>
    );
  };

  const renderCard = ({ item }) => (
    <Card containerStyle={{ borderRadius: 10, padding: 0, margin: 10 }}>
      <TouchableOpacity onPress={() => navigateToMealDetails(item)}>
        {item.mealImage ? (
          <Image
            source={{ uri: item.mealImage }}
            style={{ width: '100%', height: 200, borderRadius: 10 }}
          />
        ) : (
          <View style={{ width: '100%', height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eaeaea', borderRadius: 10 }}>
            <Text style={{ color: '#bbb' }}>No Image Available</Text>
          </View>
        )}
        <View style={{ position: 'absolute', bottom: 0, borderRadius: 10, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{item.mealName}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="clock-o" type="font-awesome" color="white" size={18} style={{ marginRight: 5 }} />
              <Text style={{ color: 'white' }}>{item.mealTotalTime}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="fire" type="font-awesome" color="white" size={18} style={{ marginRight: 5 }} />
              <Text style={{ color: 'white' }}>{item.mealCalories}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="users" type="font-awesome" color="white" size={18} style={{ marginRight: 5 }} />
              <Text style={{ color: 'white' }}>{item.mealServing}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={{ position: 'absolute', top: 10, right: 10 }}>
        {renderFavoriteButton(item.mealId)}
      </View>
    </Card>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <SearchBar
        placeholder="Search for meals..."
        onChangeText={setSearch}
        value={search}
        lightTheme
        round
        containerStyle={{
          backgroundColor: 'transparent',
          borderBottomColor: 'transparent',
          borderTopColor: 'transparent',
        }}
        inputContainerStyle={{ backgroundColor: '#eaeaea' }}
      />
      <View style={{ marginVertical: 10 }} className="my-1 px-3">
        <Text className="text-lg font-bold mb-2" style={{ fontSize: 18, fontWeight: 'bold', paddingHorizontal: 2 }}>
          Categories
        </Text>
        {renderCategoryButtons()}
      </View>

      <View className="my-5 px-3">
        <Text className="text-lg font-bold mb-2">Meals</Text>
        <FlatList
          data={filteredMeals}
          keyExtractor={(item) => item.mealId.toString()}
          renderItem={renderCard}
        />
      </View>
    </ScrollView>
  );
}
