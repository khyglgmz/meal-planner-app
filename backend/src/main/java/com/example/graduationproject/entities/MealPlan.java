package com.example.graduationproject.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MealPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer mealPlanID;
    String mealPlanName;
    Date startDate;
    Date endDate;


    @JsonBackReference("userDetail-mealPlans")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userId")
    private UserDetail userDetail;

    @JsonManagedReference("meal-mealPlans")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mealID")
    private Meal meal;

    @Enumerated(EnumType.STRING)
    private MealCategory mealCategory; // e.g., "breakfast", "lunch", "dinner"

    private Integer dayOfWeek;

}
