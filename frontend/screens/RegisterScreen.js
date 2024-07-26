import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, Image } from 'react-native';
import axiosInstance from '../services/axiosConfig';
import Picker from 'react-native-picker-select';
import LogoImage from '../assets/logo.png'; // Adjust the path as per your actual project structure


const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    age: '',
    height: '',
    weight: '',

    activityLevel: '',
    healthGoals: ''
  });



  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegister = async () => {
    try {
      const response = await axiosInstance.post('/register', form);
      if (response.status === 200) {
        navigation.navigate('Login');
      } else {
        Alert.alert('Registration Failed', 'Please try again');
      }
    } catch (error) {
      console.error('Error registering:', error);
      Alert.alert('Registration Failed', 'An error occurred. Please try again.');
    }
  };
  return (
    <ScrollView>
       <View style={{ flex: 1, padding: 20 }}>
       <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image 
        style={{ width: 150, height: 150, margin: 20, marginRight: 20 }}
        source={LogoImage} resizeMode="contain" />
           </View>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#4CAF50', borderRadius: 5, padding: 10, marginBottom: 10 }}
          placeholder="Username"
          value={form.username}
          onChangeText={(value) => handleInputChange('username', value)}
        />
        
        <TextInput
          style={{ borderWidth: 1, borderColor: '#4CAF50', borderRadius: 5, padding: 10, marginBottom: 10 }}
          placeholder="Password"
          value={form.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
        />
        <TextInput
          style={{ borderWidth: 1, borderColor: '#4CAF50', borderRadius: 5, padding: 10, marginBottom: 10 }}
          placeholder="Email"
          value={form.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <TextInput
          style={{ borderWidth: 1, borderColor: '#4CAF50', borderRadius: 5, padding: 10, marginBottom: 10 }}
          placeholder="First Name"
          value={form.firstName}
          onChangeText={(value) => handleInputChange('firstName', value)}
        />
        <TextInput
          style={{ borderWidth: 1, borderColor: '#4CAF50', borderRadius: 5, padding: 10, marginBottom: 10 }}
          placeholder="Last Name"
          value={form.lastName}
          onChangeText={(value) => handleInputChange('lastName', value)}
        />
        <TextInput
          style={{ borderWidth: 1, borderColor: '#4CAF50', borderRadius: 5, padding: 10, marginBottom: 10 }}
          placeholder="Age"
          value={form.age}
          onChangeText={(value) => handleInputChange('age', value)}
          keyboardType="numeric"
        />
        <TextInput
          style={{ borderWidth: 1, borderColor: '#4CAF50', borderRadius: 5, padding: 10, marginBottom: 10 }}
          placeholder="Height"
          value={form.height}
          onChangeText={(value) => handleInputChange('height', value)}
          keyboardType="numeric"
        />
        <TextInput
          style={{ borderWidth: 1, borderColor: '#4CAF50', borderRadius: 5, padding: 10, marginBottom: 10 }}
          placeholder="Weight"
          value={form.weight}
          onChangeText={(value) => handleInputChange('weight', value)}
          keyboardType="numeric"
        />
        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginBottom: 10 }}>Gender</Text>
          <Picker
            value={form.gender}
            onValueChange={(value) => handleInputChange('gender', value)}
            items={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' }
            ]}
            style={{ inputIOS: { height: 50, width: '100%', borderWidth: 1, borderColor: '#4CAF50', borderRadius: 5, padding: 10 } }}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginBottom: 10 }}>Activity Level</Text>
          <Picker
            value={form.activityLevel}
            onValueChange={(value) => handleInputChange('activityLevel', value)}
            items={[
              { label: 'sedentary', value: 'sedentary' },
              { label: 'lightly active', value: 'lightly active' },
              { label: 'moderately active', value: 'moderately active' },
              { label: 'very active', value: 'very active' },
              { label: 'super active', value: 'super active' }
            ]}
            style={{ inputIOS: { height: 50, width: '100%', borderWidth: 1, borderColor: '#4CAF50', borderRadius: 5, padding: 10 } }}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginBottom: 10 }}>Health Goals</Text>
          <Picker
            value={form.healthGoals}
            onValueChange={(value) => handleInputChange('healthGoals', value)}
            items={[
              { label: 'weight loss', value: 'weight loss' },
              { label: 'maintenance', value: 'maintenance' },
              { label: 'weight gain', value: 'weight gain' }
            ]}
            style={{ inputIOS: { height: 50, width: '100%', borderWidth: 1, borderColor: '#4CAF50', borderRadius: 5, padding: 10 } }}
          />
        </View>
        <Button
          title="Register"
          onPress={handleRegister}
          color="#FFA07A" // Text color
          style={{
            backgroundColor: '#FFA07A', // Button background color
            borderColor: '#FFA07A', // Border color
            borderWidth: 1, // Border width
            borderRadius: 5, // Border radius
            padding: 10,
            marginBottom: 10
          }}
        />
        <Button
          title="Already a member? Login"
          onPress={() => navigation.navigate('Login')}
          color="#FFA07A" // Text color
          style={{
            backgroundColor: '#ffffff', // Button background color
            borderColor: '#FFA07A', // Border color
            borderWidth: 1, // Border width
            borderRadius: 5, // Border radius
            padding: 10,
            marginTop: 10
          }}
        />
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;