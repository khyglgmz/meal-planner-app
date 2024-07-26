package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoMeal;
import com.example.graduationproject.entities.Meal;
import org.hibernate.annotations.SecondaryRow;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface MealService {
    List<Meal> createMeals(List<DtoMeal> dtoMeals);
    public Meal updateMeal(Integer mealId, DtoMeal dtoMeal);
    public List<Meal> getAllMeals();
    public Meal getMealById(Integer mealId);
    public void deleteMealById(Integer mealId);
}
