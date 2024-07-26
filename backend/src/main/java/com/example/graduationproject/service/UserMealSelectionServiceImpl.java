package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoUserMealSelection;
import com.example.graduationproject.entities.UserMealSelection;
import com.example.graduationproject.repository.UserMealSelectionRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserMealSelectionServiceImpl implements UserMealSelectionService{
    private final UserMealSelectionRepository userMealSelectionRepository;
    private final ModelMapper modelMapper;

    public UserMealSelectionServiceImpl(UserMealSelectionRepository userMealSelectionRepository, ModelMapper modelMapper) {
        this.userMealSelectionRepository = userMealSelectionRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public UserMealSelection createUserMealSelection(DtoUserMealSelection dtoUserMealSelection) {
        UserMealSelection userMealSelection = new UserMealSelection();
        modelMapper.map(dtoUserMealSelection, userMealSelection);

        return userMealSelectionRepository.save(userMealSelection);
    }

    @Override
    public UserMealSelection updateUserMealSelection(Integer userMealSelectionId, DtoUserMealSelection dtoUserMealSelection) {
        Optional<UserMealSelection> optionalUserMealSelection = userMealSelectionRepository.findById(userMealSelectionId);
        if(optionalUserMealSelection.isPresent()){
            UserMealSelection userMealSelection = optionalUserMealSelection.get();
            modelMapper.map(dtoUserMealSelection, userMealSelection);
            return userMealSelectionRepository.save(userMealSelection);
        }
        return null;
    }

    @Override
    public List<UserMealSelection> getAllUserMealSelection() {
        return (List<UserMealSelection>) userMealSelectionRepository.findAll();
    }

    @Override
    public Optional<UserMealSelection> getUserMealSelectionById(Integer userMealSelectionId) {
        return userMealSelectionRepository.findById(userMealSelectionId);
    }

    @Override
    public void deleteUserMealSelectionById(Integer userMealSelectionId) {
        userMealSelectionRepository.deleteById(userMealSelectionId);
    }
}
