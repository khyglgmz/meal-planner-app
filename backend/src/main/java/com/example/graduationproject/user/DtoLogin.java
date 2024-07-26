package com.example.graduationproject.user;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DtoLogin {
    private String username;
    private String password;
}
