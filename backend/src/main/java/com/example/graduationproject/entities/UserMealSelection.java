package com.example.graduationproject.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.userdetails.User;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserMealSelection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer selectionID;


    float mealRating;
    String mealReview;

    @JsonBackReference("userDetail-userMealSelections")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userId")
    private UserDetail userDetail;

    @JsonBackReference("meal-userMealSelections")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mealID")
    private Meal meal;}