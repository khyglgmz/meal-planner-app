package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoMeal;
import com.example.graduationproject.entities.Meal;
import com.example.graduationproject.repository.MealRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MealServiceImpl implements MealService {
    @Autowired
    private final MealRepository mealRepository;
    private final ModelMapper modelMapper;

    public MealServiceImpl(MealRepository mealRepository, ModelMapper modelMapper) {
        this.mealRepository = mealRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<Meal> createMeals(List<DtoMeal> dtoMeals) {
        List<Meal> savedMeals = new ArrayList<>();

        for (DtoMeal dtoMeal : dtoMeals) {
            Meal meal = new Meal();
            modelMapper.map(dtoMeal, meal);
            savedMeals.add(mealRepository.save(meal));
        }

        return savedMeals;
    }
    @Override
    public Meal updateMeal(Integer mealId, DtoMeal dtoMeal){
        Optional<Meal> mealOptional = mealRepository.findById(mealId);

        if(mealOptional.isPresent()){
            Meal meal = mealOptional.get();
            modelMapper.map(dtoMeal, meal);
            return mealRepository.save(meal);
        }
        return null;//hata gönder
    }
    @Override
    public List<Meal> getAllMeals(){
        return (List<Meal>) mealRepository.findAll();
    }
    @Override
    public  Meal getMealById(Integer mealId){
        return mealRepository.findById(mealId).orElse(null); // hata at
    }
    @Override
    public void deleteMealById(Integer mealId){
        mealRepository.deleteById(mealId);
    }


}
