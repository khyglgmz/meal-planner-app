package com.example.graduationproject.dataTransferObjects;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DtoUserMealSelection {
    float dtoMealRating;
    String dtoMealReview;
}
