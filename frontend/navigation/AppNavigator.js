import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; 
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainScreen from '../screens/MainScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AllMealsScreen from '../screens/AllMealsScreen';
import MealDetailsScreen from '../screens/MealDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MealPlanScreen from '../screens/MealPlanScreen'; 
import { AuthContext } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Favorites') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'MealPlan') {
          iconName = focused ? 'restaurant' : 'restaurant-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={30} color={'#FFA07A'} />;
      },
      tabBarActiveTintColor: '#ff4900',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={MainScreen} options={{ title: 'Home' }} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
    <Tab.Screen name="MealPlan" component={MealPlanScreen} options={{ title: 'Meal Plan' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />

  </Tab.Navigator>
);

const AuthenticatedApp = () => (
  <Stack.Navigator initialRouteName="MainTab">
    <Stack.Screen name="MainTab" component={MainTabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="AllMeals" component={AllMealsScreen} options={{ title: 'All Meals', headerShown: false }} />
    <Stack.Screen name="MealDetails" component={MealDetailsScreen} options={{ title: 'Meal Details' }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName={isAuthenticated  ? 'AuthenticatedApp' : 'Login'}>
      {isAuthenticated  ? (
        <Stack.Screen name="AuthenticatedApp" component={AuthenticatedApp} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
