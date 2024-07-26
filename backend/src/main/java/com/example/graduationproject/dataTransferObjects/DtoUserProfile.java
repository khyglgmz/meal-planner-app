package com.example.graduationproject.dataTransferObjects;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DtoUserProfile {
    Integer userProfileId;
    String healthGoals;
    Integer age;
    String gender;
    Float height;
    Float weight;
    String activityLevel;
    Integer userId;

}
