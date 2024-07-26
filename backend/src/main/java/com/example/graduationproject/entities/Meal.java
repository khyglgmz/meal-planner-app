package com.example.graduationproject.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mealId;
    @Column(columnDefinition = "TEXT")
    private String mealName;
    @Column(columnDefinition = "TEXT")
    private String mealDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_category")
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

    @JsonBackReference("meal-mealPlans")
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "meal")
    private List<MealPlan> mealPlans;

    @JsonManagedReference("meal-favorites")
    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<UserFavorites> favorites = new HashSet<>();

}
