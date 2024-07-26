package com.example.graduationproject.controller;

import com.example.graduationproject.dataTransferObjects.DtoMeal;
import com.example.graduationproject.entities.Meal;
import com.example.graduationproject.repository.MealRepository;
import com.example.graduationproject.service.MealService;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(value ="/api/meal")
public class MealController {
    @Autowired
    private MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    private MealRepository mealRepository;
    @GetMapping(value = "/get/{mealId}")
    public Meal getMealById(@PathVariable Integer mealId){
        return mealService.getMealById(mealId);
    }

    @GetMapping(value ="/get")
    public List<Meal> getAllMeals(){
        return mealService.getAllMeals();
    }

    @PostMapping("/create")
    public ResponseEntity<List<Meal>> createMeal(@RequestBody List<DtoMeal> dtoMeals) {
        List<Meal> savedMeals = mealService.createMeals(dtoMeals);
        return ResponseEntity.ok(savedMeals);
    }

    @PutMapping(value = "/update/{mealId}")
    public Meal updateMeal(@PathVariable Integer mealId, @RequestBody DtoMeal dtoMeal){
        return mealService.updateMeal(mealId, dtoMeal);
    }

    @DeleteMapping(value = "/delete/{mealId}")
    public void deleteMealById(@PathVariable Integer mealId){
        mealService.deleteMealById(mealId);
    }


}
