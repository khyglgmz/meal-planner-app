import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axiosInstance from '../services/axiosConfig';
import { AuthContext } from '../contexts/AuthContext';
import Picker from 'react-native-picker-select';
import { MaterialIcons } from '@expo/vector-icons'; // Example icon library, replace with your preferred library

const ProfileScreen = ({ navigation }) => {
  const { userId, logout } = useContext(AuthContext);
  const [userDetail, setUserDetail] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: ''
  });
  const [userProfile, setUserProfile] = useState({
    healthGoals: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const userDetailResponse = await axiosInstance.get(`/user/get/${userId}`);
      setUserDetail(userDetailResponse.data);

      const userProfileResponse = await axiosInstance.get(`/user-profile/get/${userId}`);
      setUserProfile(userProfileResponse.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.');
        await logout();
        navigation.navigate('Login');
      } else {
        setError('Error fetching user details: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserDetail = async () => {
    try {
      await axiosInstance.put(`/user/update/${userId}`, userDetail);
      Alert.alert('Success', 'User details updated successfully');
    } catch (err) {
      setError('Error updating user details: ' + err.message);
    }
  };

  const updateUserProfile = async () => {
    try {
      await axiosInstance.put(`/user-profile/update/${userId}`, userProfile);
      Alert.alert('Success', 'User profile updated successfully');
    } catch (err) {
      setError('Error updating user profile: ' + err.message);
    }
  };

  const handleUpdateUserDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateUserDetail();
    } catch (err) {
      setError('Error updating user details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateUserProfile();
    } catch (err) {
      setError('Error updating user profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await logout();
            navigation.navigate('Login');
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Details Section */}
      <Text style={styles.sectionTitle}>Account Settings</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Username</Text>
          <MaterialIcons name="person" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={userDetail.username}
            onChangeText={(text) => setUserDetail({ ...userDetail, username: text })}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email</Text>
          <MaterialIcons name="email" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={userDetail.email}
            onChangeText={(text) => setUserDetail({ ...userDetail, email: text })}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>First Name</Text>
          <MaterialIcons name="account-circle" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={userDetail.firstName}
            onChangeText={(text) => setUserDetail({ ...userDetail, firstName: text })}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Last Name</Text>
          <MaterialIcons name="account-circle" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={userDetail.lastName}
            onChangeText={(text) => setUserDetail({ ...userDetail, lastName: text })}
          />
        </View>
      </View>

      {/* User Profile Section */}
      <Text style={styles.sectionTitle}>User Information</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Age</Text>
          <MaterialIcons name="accessibility" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={userProfile.age ? userProfile.age.toString() : ''}
            onChangeText={(text) => setUserProfile({ ...userProfile, age: text })}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Height (cm)</Text>
          <MaterialIcons name="height" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Height (cm)"
            keyboardType="numeric"
            value={userProfile.height ? userProfile.height.toString() : ''}
            onChangeText={(text) => setUserProfile({ ...userProfile, height: parseFloat(text) })}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Weight (kg)</Text>
          <MaterialIcons name="fitness-center" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            keyboardType="numeric"
            value={userProfile.weight ? userProfile.weight.toString() : ''}
            onChangeText={(text) => setUserProfile({ ...userProfile, weight: parseFloat(text) })}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Gender</Text>
          <MaterialIcons name="wc" size={24} color="black" style={styles.icon} />
          <Picker
            value={userProfile.gender}
            onValueChange={(value) => setUserProfile({ ...userProfile, gender: value })}
            items={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' }
            ]}
            style={pickerSelectStyles}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Activity Level</Text>
          <MaterialIcons name="directions-run" size={24} color="black" style={styles.icon} />
          <Picker
            value={userProfile.activityLevel}
            onValueChange={(value) => setUserProfile({ ...userProfile, activityLevel: value })}
            items={[
              { label: 'Sedentary', value: 'sedentary' },
              { label: 'Lightly Active', value: 'lightly active' },
              { label: 'Moderately Active', value: 'moderately active' },
              { label: 'Very Active', value: 'very active' },
              { label: 'Super Active', value: 'super active' }
            ]}
            style={pickerSelectStyles}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Health Goals</Text>
          <MaterialIcons name="favorite" size={24} color="black" style={styles.icon} />
          <Picker
            value={userProfile.healthGoals}
            onValueChange={(value) => setUserProfile({ ...userProfile, healthGoals: value })}
            items={[
              { label: 'Weight Loss', value: 'weight loss' },
              { label: 'Maintenance', value: 'maintenance' },
              { label: 'Weight Gain', value: 'weight gain' }
            ]}
            style={pickerSelectStyles}
          />
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateUserDetail}>
        <Text style={styles.buttonText}>Update Account Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateUserProfile}>
        <Text style={styles.buttonText}>Update User Information</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80, // Adjust as necessary based on the content and styles
    backgroundColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row', // Ensure icons and labels are aligned horizontally
    alignItems: 'center', // Align items vertically in the center
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    marginLeft: 10, // Adjust margin for label positioning
  },
  pickerContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  updateButton: {
    backgroundColor: '#FFA07A',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20, // Adjust this value as per your design
    left: 20, // Adjust this value as per your design
    right: 20, // Adjust this value as per your design
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
};

export default ProfileScreen;
