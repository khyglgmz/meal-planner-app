import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TabView, TabBar } from 'react-native-tab-view';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { FavoritesContext } from '../contexts/FavoritesContext'; // Adjust the path if necessary

const MealDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { favoriteMeals, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const [meal, setMeal] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'ingredients', title: 'Ingredients' },
    { key: 'instructions', title: 'Instructions' },
    { key: 'nutrition', title: 'Nutrition' },
  ]);

  useEffect(() => {
    if (route.params && route.params.meal) {
      setMeal(route.params.meal);
    }
  }, [route.params]);

  const initialLayout = { width: Dimensions.get('window').width };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'ingredients':
        return (
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {meal && meal.mealIngredients ? (
              meal.mealIngredients.split(';').map((ingredient, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                  <Icon name="circle" type="font-awesome" size={10} color="#FFA07A" style={{ marginRight: 8 }} />
                  <Text>{ingredient.trim()}</Text>
                </View>
              ))
            ) : (
              <Text>No ingredients found</Text>
            )}
          </ScrollView>
        );
      case 'instructions':
        return (
          <ScrollView contentContainerStyle={{ padding: 16 }}>
          {meal && meal.mealPreparationSteps ? (
            meal.mealPreparationSteps
              .split('step ')
              .filter(step => step.trim() !== '')
              .map((step, index) => {
                const stepText = step.replace(/^\d+:?\s*/, ''); // Removes the step number if present
                return (
                  <View key={index} style={{ flexDirection: 'row', marginVertical: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="chevron-right" type="font-awesome" size={14} color="#FFA07A" style={{ marginRight: 8 }} />
                      <Text style={{ fontWeight: 'bold', marginRight: 8 }}>{index + 1}. </Text>
                    </View>
                    <Text style={{ flex: 1 }}>{stepText.trim()}</Text>
                  </View>
                );
              })
          ) : (
            <Text>No preparation steps found</Text>
          )}
        </ScrollView>
      );
      case 'nutrition':
        const protein = meal && meal.mealProteinInformation ? parseFloat(meal.mealProteinInformation) : 0;
        const fat = meal && meal.mealFatInformation ? parseFloat(meal.mealFatInformation) : 0;
        const carbs = meal && meal.mealChInformation ? parseFloat(meal.mealChInformation) : 0;
        const totalNutrients = protein + fat + carbs;

        const proteinPercentage = totalNutrients ? (protein / totalNutrients) * 100 : 0;
        const fatPercentage = totalNutrients ? (fat / totalNutrients) * 100 : 0;
        const carbsPercentage = totalNutrients ? (carbs / totalNutrients) * 100 : 0;

        return (
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
                <Text>Calories:</Text>
                <Text>{meal && meal.mealCalories ? meal.mealCalories : 'N/A'}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
                <Text>Protein:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{protein}g</Text>
                  <AnimatedCircularProgress
                    size={100}
                    width={10}
                    fill={proteinPercentage}
                    tintColor="#FFA07A"
                    backgroundColor="#E0E0E0"
                    rotation={0}
                    lineCap="round"
                    style={{ marginLeft: 8 }}
                  >
                    {() => (
                      <Text style={{ position: 'absolute', fontSize: 16, fontWeight: 'bold' }}>{Math.round(proteinPercentage)}%</Text>
                    )}
                  </AnimatedCircularProgress>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
                <Text>Fat:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{fat}g</Text>
                  <AnimatedCircularProgress
                    size={100}
                    width={10}
                    fill={fatPercentage}
                    tintColor="#FFA07A"
                    backgroundColor="#E0E0E0"
                    rotation={0}
                    lineCap="round"
                    style={{ marginLeft: 8 }}
                  >
                    {() => (
                      <Text style={{ position: 'absolute', fontSize: 16, fontWeight: 'bold' }}>{Math.round(fatPercentage)}%</Text>
                    )}
                  </AnimatedCircularProgress>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
                <Text>Carbs:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{carbs}g</Text>
                  <AnimatedCircularProgress
                    size={100}
                    width={10}
                    fill={carbsPercentage}
                    tintColor="#FFA07A"
                    backgroundColor="#E0E0E0"
                    rotation={0}
                    lineCap="round"
                    style={{ marginLeft: 8 }}
                  >
                    {() => (
                      <Text style={{ position: 'absolute', fontSize: 16, fontWeight: 'bold' }}>{Math.round(carbsPercentage)}%</Text>
                    )}
                  </AnimatedCircularProgress>
                </View>
              </View>
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#FFA07A' }}
      style={{ backgroundColor: '#FFF', elevation: 0 }}
      labelStyle={{ color: '#333', fontWeight: 'bold', fontSize: 13 }}
    />
  );

  const isFavorite = meal && favoriteMeals.some(favoriteMeal => favoriteMeal.mealId === meal.mealId);

  const handleFavoritePress = () => {
    if (!meal) {
      console.error('Meal is undefined');
      return;
    }
  
    const { userId, mealId } = meal;
  
    if (!userId || !mealId) {
      console.error('userId or mealId is undefined');
      return;
    }
  
    if (isFavorite) {
      removeFavorite(userId, mealId);
    } else {
      addFavorite(userId, mealId);
    }
  };
  


  if (!meal) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Image source={{ uri: meal.mealImage }} style={{ width: '100%', height: 250, borderRadius: 10, marginBottom: 16 }} />

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>{meal.mealName}</Text>
      <View style={{ flexDirection: 'row', paddingRight: 15, paddingLeft:15}}>
      <View style={{  alignItems: 'center', marginBottom: 10 , padding: 15}}>
        <Icon name='clock' type='feather' color='#FFA07A' size={30} style={{ marginRight: 8 , padding: 10}} />
        <Text style={{ marginTop: 15 }}>{meal.mealTotalTime}</Text>
      </View>
      <View style={{  alignItems: 'center', marginBottom: 16, padding: 15 }}>
        <Icon name='fire' type='font-awesome' color='#FFA07A' size={30} style={{ marginRight: 8, padding: 10 }} />
        <Text style={{ marginTop: 15 }}>Total Calories: {meal.mealCalories}</Text>
      </View>
      <View style={{ alignItems: 'center', marginBottom: 16 , padding: 15}}>
        <Icon name='users' type='font-awesome' color='#FFA07A' size={30} style={{ marginRight: 8, padding: 10 }} />
        <Text style={{ marginTop: 15 }}>Servings: {meal.mealServings}</Text>
      </View>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />

      <Button
        title="Go Back"
        buttonStyle={{ backgroundColor: '#FFA07A', marginTop: 20 }}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default MealDetailsScreen;
