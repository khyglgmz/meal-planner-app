package com.example.graduationproject.dataTransferObjects;

import jakarta.persistence.Entity;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DtoRegistration {
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String gender;
    private Integer age;
    private Float height;
    private Float weight;
    private String activityLevel;
    private String healthGoals;
}
