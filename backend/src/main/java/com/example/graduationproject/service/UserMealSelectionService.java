package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoUserMealSelection;
import com.example.graduationproject.entities.UserMealSelection;
import org.springframework.data.relational.core.sql.In;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface UserMealSelectionService {
    public UserMealSelection createUserMealSelection(DtoUserMealSelection dtoUserMealSelection);
    public UserMealSelection updateUserMealSelection(Integer userMealSelectionId, DtoUserMealSelection dtoUserMealSelection);

    public List<UserMealSelection> getAllUserMealSelection();

    public Optional<UserMealSelection> getUserMealSelectionById(Integer userMealSelectionId);

    public void deleteUserMealSelectionById(Integer userMealSelectionId);

}
