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
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer userProfileId;

    String healthGoals;
    Integer age;
    String gender;
    Float height;
    Float weight;
    String activityLevel;
    @JsonBackReference("userDetail-userProfile")
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userId")
    private UserDetail userDetail;
}

