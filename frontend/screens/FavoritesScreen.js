import React, { useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { Card, Icon, Image } from 'react-native-elements';

const FavoritesScreen = ({ navigation }) => {
  const { userId } = useContext(AuthContext);
  const { favoriteMeals, fetchUserFavorites, removeFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    if (userId) {
      fetchUserFavorites(userId);
    } 
  }, [userId]);

  const navigateToMealDetails = (meal) => {
    navigation.navigate('MealDetails', { meal });
  };

   const handleRemoveFavorite = async (userFavoriteID) => {
    if (userId) {
      await removeFavorite(userFavoriteID);
    } else {
      Alert.alert('Error', 'User ID is missing.');
    }
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToMealDetails(item)}>
      <Card containerStyle={{ borderRadius: 10, padding: 0, margin: 10 }}>
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
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{item.mealName}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="clock-o" type="font-awesome" color="white" size={18} />
              <Text style={{ color: 'white', marginLeft: 5 }}>{item.mealTotalTime}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="fire" type="font-awesome" color="white" size={18} />
              <Text style={{ color: 'white', marginLeft: 5 }}>{item.mealCalories}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="users" type="font-awesome" color="white" size={18} />
              <Text style={{ color: 'white', marginLeft: 5 }}>{item.mealServing}</Text>
            </View>
          </View>
        </View>
        <View style={{ position: 'absolute', top: 10, right: 10 }}>
          <TouchableOpacity onPress={() => handleRemoveFavorite(item.mealId)}>
            <Icon name="heart" type="font-awesome" color="red" />
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const keyExtractor = (item) => item.mealId.toString();

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>Favorite Meals</Text>
      <FlatList
        data={favoriteMeals}
        renderItem={renderCard}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default FavoritesScreen;
