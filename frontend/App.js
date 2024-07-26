import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { NavigationContainer } from '@react-navigation/native';


const App = () => (
  <NavigationContainer>
  <AuthProvider>
    <FavoritesProvider>
      <AppNavigator />
    </FavoritesProvider>
  </AuthProvider>
</NavigationContainer>
);

export default App;
