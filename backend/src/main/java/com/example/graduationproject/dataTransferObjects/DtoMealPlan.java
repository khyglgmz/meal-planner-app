package com.example.graduationproject.dataTransferObjects;

import com.example.graduationproject.entities.MealCategory;
import com.example.graduationproject.entities.UserDetail;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.util.Date;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DtoMealPlan {

    private Integer userId;
    private String mealPlanName;
    private Date startDate;
    private Date endDate;
    private Integer dayOfWeek;
    private DtoMeal meal;
    private MealCategory mealCategory;
    private Integer mealId;

}
