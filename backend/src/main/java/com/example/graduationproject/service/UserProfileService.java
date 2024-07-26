package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoUserProfile;
import com.example.graduationproject.entities.UserProfile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface UserProfileService {
    public UserProfile createUserProfile(DtoUserProfile dtoUserProfile);
    public UserProfile updateUserProfile(Integer userProfileId, DtoUserProfile dtoUserProfile);
    public List<UserProfile> getAllUserProfile();
    public Optional<UserProfile> getUserProfileById(Integer userProfileId);
    public void deleteUserProfileById(Integer userProfileId);
}
