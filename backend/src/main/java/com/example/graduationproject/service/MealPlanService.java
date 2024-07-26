package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoMealPlan;
import com.example.graduationproject.entities.MealPlan;
import com.example.graduationproject.entities.UserDetail;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public interface MealPlanService {

    public MealPlan createMealPlan(DtoMealPlan dtoMealPlan);

    public MealPlan updateMealPlan(Integer mealPlanId, DtoMealPlan dtoMealPlan);

    public List<MealPlan> getAllMealPlan();

    public Optional<MealPlan> getMealPlanById(Integer mealPlanId);

    public void deleteMealPlanById(Integer mealPlanId);
    public Map<String, Object> generateMealPlan(UserDetail userDetail,  Date startDate);
    List<MealPlan> findMealPlansByUserDetail(UserDetail userDetail);
    public List<MealPlan> findMealPlansForDay(Integer userId, Integer day);


}


































































































