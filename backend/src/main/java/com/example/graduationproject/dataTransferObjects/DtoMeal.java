package com.example.graduationproject.dataTransferObjects;

import com.example.graduationproject.entities.MealCategory;

import jakarta.persistence.Column;
import lombok.*;

import java.util.Set;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DtoMeal {
    @Column(columnDefinition = "TEXT")
    private String mealName;
    @Column(columnDefinition = "TEXT")
    private String mealDescription;
    private MealCategory mealCategory;
    private String mealPreparationTime;
    private String mealCookingTime;
    private String mealTotalTime;
    @Column(columnDefinition = "TEXT")
    private String mealIngredients;
    private Integer mealCalories;
    private String mealProteinInformation;
    private String mealFatInformation;
    private String mealChInformation;
    @Column(columnDefinition = "TEXT")
    private String mealPreparationSteps;
    private String mealServing;
    @Column(columnDefinition = "TEXT")
    private String mealImage;

}
