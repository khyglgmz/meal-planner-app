package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoMealPlan;
import com.example.graduationproject.entities.*;
import com.example.graduationproject.repository.MealPlanRepository;
import com.example.graduationproject.repository.MealRepository;
import com.example.graduationproject.repository.UserDetailRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;


@Service

public class MealPlanServiceImpl implements MealPlanService{
    private final MealPlanRepository mealPlanRepository;
    private final ModelMapper modelMapper;
    private final UserDetailRepository userDetailRepository;
    private final MealRepository mealRepository;

    public MealPlanServiceImpl(MealPlanRepository mealPlanRepository, ModelMapper modelMapper, UserDetailRepository userDetailRepository, MealRepository mealRepository) {
        this.mealPlanRepository = mealPlanRepository;
        this.modelMapper = modelMapper;
        this.userDetailRepository = userDetailRepository;
        this.mealRepository = mealRepository;
    }

    @Override
    public MealPlan createMealPlan(DtoMealPlan dtoMealPlan) {
        // Map DtoMealPlan to MealPlan entity
        MealPlan mealPlan = modelMapper.map(dtoMealPlan, MealPlan.class);

        // Fetch UserDetail from repository based on userID
        Integer userId = dtoMealPlan.getUserId(); // Assuming you have a getter for userId in DtoMealPlan
        Optional<UserDetail> userDetailOptional = userDetailRepository.findById(userId);

        if (userDetailOptional.isPresent()) {
            mealPlan.setUserDetail(userDetailOptional.get());
            return mealPlanRepository.save(mealPlan);
        } else {
            // Handle case where UserDetail with given userId is not found
            throw new IllegalArgumentException("UserDetail with userID " + userId + " not found.");
        }
    }

    @Override
    public MealPlan updateMealPlan(Integer mealPlanId, DtoMealPlan dtoMealPlan) {
        Optional<MealPlan> mealPlanOptional = mealPlanRepository.findById(mealPlanId);
        if(mealPlanOptional.isPresent()){
            MealPlan mealPlan = mealPlanOptional.get();
            modelMapper.map(dtoMealPlan, mealPlan);
            UserDetail userDetail = userDetailRepository.findById(dtoMealPlan.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            mealPlan.setUserDetail(userDetail);

            // Fetch and set Meal
            Meal meal = mealRepository.findById(dtoMealPlan.getMealId())
                    .orElseThrow(() -> new RuntimeException("Meal not found"));
            mealPlan.setMeal(meal);

            return mealPlanRepository.save(mealPlan);
        }
        return null;
    }

    @Override
    public List<MealPlan> getAllMealPlan() {
        return (List<MealPlan>) mealPlanRepository.findAll();
    }

    @Override
    public Optional<MealPlan> getMealPlanById(Integer mealPlanId) {
        return mealPlanRepository.findById(mealPlanId);
    }

    @Override
    public void deleteMealPlanById(Integer mealPlanId) {
        mealPlanRepository.deleteById(mealPlanId);
    }

    private double calculateBMR(UserProfile userProfile) {
        double bmr;
        if ("Male".equalsIgnoreCase(userProfile.getGender())) {
            bmr = 88.362 + (13.397 * userProfile.getWeight()) + (4.799 * userProfile.getHeight()) - (5.677 * userProfile.getAge());
        } else {
            bmr = 447.593 + (9.247 * userProfile.getWeight()) + (3.098 * userProfile.getHeight()) - (4.330 * userProfile.getAge());
        }
        return bmr;
    }

    private double adjustBMRForHealthGoal(double tdee, String healthGoal) {
        return switch (healthGoal.toLowerCase()) {
            case "weight loss" -> tdee - 500; // 500 kcal deficit
            case "weight gain" -> tdee + 500; // 500 kcal surplus
            case "maintenance" -> tdee;
            default -> tdee;
        };
    }
    private double adjustBMRForActivityLevel(double bmr, String activityLevel) {
        return switch (activityLevel.toLowerCase()) {
            case "sedentary" -> bmr * 1.2;
            case "lightly active" -> bmr * 1.375;
            case "moderately active" -> bmr * 1.55;
            case "very active" -> bmr * 1.725;
            case "super active" -> bmr * 1.9;
            default -> bmr;
        };
    }

    private MealPlan createMealPlanEntry(UserDetail userDetail, Meal meal, MealCategory mealCategory, int dayOfWeek, Date startDate, Date endDate) {
        return MealPlan.builder()
                .mealPlanName(userDetail.getFirstName() + "'s Meal Plan")
                .startDate(startDate)
                .endDate(endDate)
                .mealCategory(mealCategory)
                .dayOfWeek(dayOfWeek)
                .meal(meal)
                .userDetail(userDetail)
                .build();
    }


    private Meal getRandomMeal(List<Meal> meals, double targetCalories, Set<Integer> usedMealIds) {
        List<Meal> filteredMeals = meals.stream()
                .filter(meal -> meal.getMealCalories() <= targetCalories && !usedMealIds.contains(meal.getMealId()))
                .collect(Collectors.toList());

        System.out.println("Filtered Meals Count: " + filteredMeals.size());
        for (Meal meal : filteredMeals) {   
            System.out.println("Meal: " + meal.getMealName() + ", Calories: " + meal.getMealCalories());
        }

        if (filteredMeals.isEmpty()) {
            Meal closestMeal = meals.stream()
                    .filter(meal -> !usedMealIds.contains(meal.getMealId()))
                    .min(Comparator.comparingDouble(meal -> Math.abs(meal.getMealCalories() - targetCalories)))
                    .orElseThrow(() -> new IllegalArgumentException("No meals available"));

            System.out.println("No meals found within the specified calorie range. Returning closest meal: " + closestMeal.getMealName());
            return closestMeal;
        }

        // Shuffle the list to ensure more variability
        Collections.shuffle(filteredMeals);

        // Return a random meal from the filtered list
        return filteredMeals.get(new Random().nextInt(filteredMeals.size()));}

    @Override
    public List<MealPlan> findMealPlansByUserDetail(UserDetail userDetail) {
        return mealPlanRepository.findByUserDetail(userDetail);
    }

    public Map<String, Object> generateMealPlan(UserDetail userDetail,  Date startDate) {
        UserProfile userProfile = userDetail.getUserProfile();

        if (userProfile == null || userProfile.getGender() == null) {
            throw new IllegalArgumentException("UserProfile or gender is null for userDetail with ID: " + userDetail.getUserId());
        }

        double bmr = calculateBMR(userProfile);
        double tdee = adjustBMRForActivityLevel(bmr, userProfile.getActivityLevel());
        tdee = adjustBMRForHealthGoal(tdee, userProfile.getHealthGoals());

        List<Meal> breakfastMeals = mealRepository.findByMealCategory(MealCategory.fromString("BREAKFAST"));
        List<Meal> lunchMeals = mealRepository.findByMealCategory(MealCategory.fromString("LUNCH"));
        List<Meal> dinnerMeals = mealRepository.findByMealCategory(MealCategory.fromString("DINNER"));

        List<MealPlan> mealPlans = new ArrayList<>();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);
        calendar.add(Calendar.DAY_OF_YEAR, 7);
        Date endDate = calendar.getTime();
        calendar.setTime(startDate);


        Set<Integer> usedMealIds = new HashSet<>();

        for (int i = 1; i <= 7; i++) {
            MealPlan breakfastPlan = createMealPlanEntry(userDetail, getRandomMeal(breakfastMeals, tdee / 3, usedMealIds), MealCategory.BREAKFAST, calendar.get(Calendar.DAY_OF_WEEK), startDate, endDate);
            usedMealIds.add(breakfastPlan.getMeal().getMealId());
            MealPlan lunchPlan = createMealPlanEntry(userDetail, getRandomMeal(lunchMeals, tdee / 3, usedMealIds), MealCategory.LUNCH, calendar.get(Calendar.DAY_OF_WEEK), startDate, endDate);
            usedMealIds.add(lunchPlan.getMeal().getMealId());
            MealPlan dinnerPlan = createMealPlanEntry(userDetail, getRandomMeal(dinnerMeals, tdee / 3, usedMealIds), MealCategory.DINNER, calendar.get(Calendar.DAY_OF_WEEK), startDate, endDate);
            usedMealIds.add(dinnerPlan.getMeal().getMealId());

            mealPlans.add(breakfastPlan);
            mealPlans.add(lunchPlan);
            mealPlans.add(dinnerPlan);

            calendar.add(Calendar.DAY_OF_YEAR, 1);
        }
        mealPlanRepository.saveAll(mealPlans);

        Map<String, Object> result = new HashMap<>();
        result.put("mealPlans", mealPlans);
        result.put("bmr", bmr);
        result.put("tdee", tdee);
        result.put("startDate", startDate);
        result.put("endDate", endDate);

        return result;
    }
    public List<MealPlan> findMealPlansForDay(Integer userId, Integer day) {
        return mealPlanRepository.findByUserDetailUserIdAndDayOfWeek(userId, day);
    }

}




