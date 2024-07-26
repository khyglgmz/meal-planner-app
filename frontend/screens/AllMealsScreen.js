import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { SearchBar, Card, Button } from 'react-native-elements';
import axiosInstance from '../services/axiosConfig';

export default function MainScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchMeals();
  }, []);

  useEffect(() => {
    filterMeals();
  }, [search, meals]); // Depend on search and meals changes

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/meal/get');
      console.log('Categories Response:', response.data);
      const uniqueCategories = [...new Set(response.data.map(meal => meal.mealCategory))];
      setCategories(uniqueCategories);
      setMeals(response.data);
      setFilteredMeals(response.data); // Initially show all meals
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMeals = async () => {
    try {
      const response = await axiosInstance.get('/meal/get');
      console.log('Meals Response:', response.data);
      setMeals(response.data);
      setFilteredMeals(response.data); // Initially show all meals
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const filterMeals = () => {
    if (search) {
      const filtered = meals.filter(meal =>
        meal.mealName.toLowerCase().includes(search.toLowerCase()) ||
        meal.mealDescription.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMeals(filtered);
    } else {
      // If no search query, show all meals
      setFilteredMeals(meals);
    }
  };

  const navigateToAllMeals = () => {
    navigation.navigate('AllMeals'); // Navigate to the AllMeals screen
  };

  const filterByCategory = (category) => {
    if (category === 'All') {
      setFilteredMeals(meals); // Show all meals
    } else {
      const filtered = meals.filter(meal => meal.mealCategory === category);
      setFilteredMeals(filtered);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SearchBar
        placeholder="Search for meals..."
        onChangeText={setSearch}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          <Button
            key="All"
            title="All"
            buttonStyle={[styles.categoryButton, { backgroundColor: '#FFA07A' }]}
            containerStyle={styles.categoryButtonContainer}
            titleStyle={styles.categoryButtonText}
            onPress={() => filterByCategory('All')}
          />
          {categories.map((category, index) => (
            <Button
              key={index}
              title={category}
              buttonStyle={styles.categoryButton}
              containerStyle={styles.categoryButtonContainer}
              titleStyle={styles.categoryButtonText}
              onPress={() => filterByCategory(category)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meals</Text>
        {filteredMeals.map((meal, index) => (
          <Card key={index} containerStyle={styles.card}>
            <ImageBackground
              source={{ uri: meal.mealImage }}
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.overlay} />
              <Text style={styles.cardTitle}>{meal.mealName}</Text>
              <Text style={styles.cardDescription}>{meal.mealDescription}</Text>
              <View style={styles.cardDetails}>
                <Text style={styles.cardText}>Preparation Time: {meal.mealPreparationTime}</Text>
                <Text style={styles.cardText}>Calories: {meal.mealCalories}</Text>
                <Text style={styles.cardText}>Category: {meal.mealCategory}</Text>
              </View>
            </ImageBackground>
          </Card>
        ))}
        {/* Button to navigate to All Meals screen */}
        <Button
          title="View All Meals"
          buttonStyle={styles.viewAllButton}
          containerStyle={styles.viewAllButtonContainer}
          onPress={navigateToAllMeals}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInput: {
    backgroundColor: '#eaeaea',
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: '#FFA07A',
  },
  categoryButtonContainer: {
    marginHorizontal: 5,
  },
  categoryButtonText: {
    fontSize: 14,
  },
  card: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  imageBackground: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cardDetails: {
    marginTop: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  viewAllButton: {
    backgroundColor: '#FFA07A',
    marginVertical: 10,
  },
  viewAllButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
     