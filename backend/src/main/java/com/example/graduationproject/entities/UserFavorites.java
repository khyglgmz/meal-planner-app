package com.example.graduationproject.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserFavorites {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer userFavoriteID;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-favorites-userDetail")
    private UserDetail userDetail;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "meal_id")
    @JsonBackReference("meal-favorites")
    private Meal meal;
}
