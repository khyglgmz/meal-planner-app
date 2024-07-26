package com.example.graduationproject.entities;
public enum MealCategory {
    BREAKFAST,
    LUNCH,
    DINNER,
    VEGETARIAN,
    VEGAN,
    NON_VEGETARIAN,
    DESSERT,
    SNACK,
    BEVERAGE;
    public static MealCategory fromString(String category) {
        try {
            return MealCategory.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("No enum constant for value: " + category, e);
        }
    }
}
