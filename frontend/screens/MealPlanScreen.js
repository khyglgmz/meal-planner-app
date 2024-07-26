import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Image } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../services/axiosConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

const MealPlanScreen = ({ navigation }) => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [tdee, setTdee] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchStoredMealPlan = async () => {
      try {
        const storedMealPlans = await AsyncStorage.getItem('mealPlans');
        const storedBmr = await AsyncStorage.getItem('bmr');
        const storedTdee = await AsyncStorage.getItem('tdee');
        const storedStartDate = await AsyncStorage.getItem('startDate');

        if (storedMealPlans && storedBmr && storedTdee && storedStartDate) {
          setMealPlans(JSON.parse(storedMealPlans));
          setBmr(JSON.parse(storedBmr));
          setTdee(JSON.parse(storedTdee));
          setStartDate(new Date(JSON.parse(storedStartDate)));
        } else if (userId) {
          generateMealPlan();
        }
      } catch (err) {
        setError('Error loading meal plan: ' + err.message);
      }
    };

    fetchStoredMealPlan();
  }, [userId]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
    setSelectedDay(null); // Reset selected day when date changes
  };

  const generateMealPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/meal-plan/generate', { userId, startDate });
      const data = response.data;
      const roundedBmr = Math.round(data.bmr);
      const roundedTdee = Math.round(data.tdee);

      setMealPlans(data.mealPlans);
      setBmr(roundedBmr);
      setTdee(roundedTdee);

      // Store the meal plan in AsyncStorage
      await AsyncStorage.setItem('mealPlans', JSON.stringify(data.mealPlans));
      await AsyncStorage.setItem('bmr', JSON.stringify(roundedBmr));
      await AsyncStorage.setItem('tdee', JSON.stringify(roundedTdee));
      await AsyncStorage.setItem('startDate', JSON.stringify(startDate));
    } catch (err) {
      setError('Error generating meal plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToMealDetails = (meal) => {
    navigation.navigate('MealDetails', { meal });
  };

  const renderMealCard = (mealPlan, mealCategory) => (
    <Card containerStyle={{ borderRadius: 10, padding: 0, marginBottom: 10 }}>
      <TouchableOpacity onPress={() => navigateToMealDetails(mealPlan.meal)}>
        <Image
          source={{ uri: mealPlan.meal.mealImage }}
          style={{ width: '100%', height: 200, borderRadius: 10 }}
        />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{mealPlan.meal.mealName}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="clock-o" type="font-awesome" color="white" size={18} style={{ marginRight: 5 }} />
              <Text style={{ color: 'white' }}>{mealPlan.meal.mealTotalTime}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="fire" type="font-awesome" color="white" size={18} style={{ marginRight: 5 }} />
              <Text style={{ color: 'white' }}>{mealPlan.meal.mealCalories}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="users" type="font-awesome" color="white" size={18} style={{ marginRight: 5 }} />
              <Text style={{ color: 'white' }}>{mealPlan.meal.mealServing}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const renderMealPlansForDay = (day) => {
    // Adjust day index to match your expected format (1 for Monday to 7 for Sunday)
    const adjustedDay = day === 0 ? 7 : day;
    const mealPlansForDay = mealPlans.filter(mp => mp.dayOfWeek === adjustedDay);
  
    const breakfast = mealPlansForDay.find(mp => mp.mealCategory === 'BREAKFAST');
    const lunch = mealPlansForDay.find(mp => mp.mealCategory === 'LUNCH');
    const dinner = mealPlansForDay.find(mp => mp.mealCategory === 'DINNER');
  

    return (
      <View className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{getDayName(new Date(startDate).setDate(new Date(startDate).getDate() + day))}</Text>
      <Text className="text-lg font-bold my-2">Breakfast</Text>
        {breakfast ? renderMealCard(breakfast, 'BREAKFAST') : <Text className="text-gray-500 italic">No meal assigned</Text>}
        <Text className="text-lg font-bold my-2">Lunch</Text>
        {lunch ? renderMealCard(lunch, 'LUNCH') : <Text className="text-gray-500 italic">No meal assigned</Text>}
        <Text className="text-lg font-bold my-2">Dinner</Text>
        {dinner ? renderMealCard(dinner, 'DINNER') : <Text className="text-gray-500 italic">No meal assigned</Text>}
      </View>
    );
  };

  const getDayName = (date) => {
    const options = { weekday: 'short' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red', marginVertical: 10 }}>{error}</Text>}
      <TouchableOpacity style={{ backgroundColor: '#FFA07A', padding: 16, borderRadius: 10, marginVertical: 10 }} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Select Start Date</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={startDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <TouchableOpacity style={{ backgroundColor: '#FFA07A', padding: 16, borderRadius: 10, marginVertical: 10 }} onPress={generateMealPlan}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Generate Meal Plan</Text>
      </TouchableOpacity>
      {bmr && (
        <View style={{ flexDirection: 'row', paddingRight: 10, paddingLeft: 10 }}>
          <View style={{ alignItems: 'center', marginBottom: 5, padding: 30 }}>
            <Icon name="heartbeat" size={30} color="#FFA07A" style={{ marginRight: 5 }} />
            <Text style={{ fontSize: 16 }}>BMR: {bmr}</Text>
          </View>
          <View style={{ alignItems: 'center', marginBottom: 5, padding: 30 }}>
            <Icon name="fire" size={30} color="#FFA07A" style={{ marginHorizontal: 5 }} />
            <Text style={{ fontSize: 16 }}>TDEE: {tdee}</Text>
          </View>
        </View>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        {Array.from({ length: 7 }).map((_, index) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + index);
          return (
            <TouchableOpacity
              key={index}
              style={{ padding: 10, backgroundColor: 'white', borderRadius: 9, alignItems: 'center', marginHorizontal: 4 }}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>{getDayName(date)}</Text>
              <Text style={{ textAlign: 'center', fontSize: 16 }}>{date.getDate()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedDay !== null && renderMealPlansForDay(selectedDay)}
    </ScrollView>
  );
};

export default MealPlanScreen;
