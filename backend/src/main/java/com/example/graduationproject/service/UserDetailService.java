package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoUserDetail;
import com.example.graduationproject.entities.MealPlan;
import com.example.graduationproject.entities.UserDetail;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface UserDetailService {
    public UserDetail createUserDetail(DtoUserDetail dtoUserDetail);
    public UserDetail updateUserDetail(Integer userId, DtoUserDetail dtoUserDetail);

    public List<UserDetail> getAllUserDetails();

    public Optional<UserDetail> getUserDetailById(Integer userId);

    public void deleteUserDetailById(Integer userId);

    UserDetail findByUsername(String username);
    UserDetail findById(Integer userId);

    UserDetail authenticateUser(String username, String password);

}
