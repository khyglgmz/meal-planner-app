package com.example.graduationproject.repository;

import com.example.graduationproject.entities.Meal;
import com.example.graduationproject.entities.MealCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Integer> {
    List<Meal> findByMealCategory(MealCategory mealCategory);
}
