package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoUserProfile;
import com.example.graduationproject.entities.UserDetail;
import com.example.graduationproject.entities.UserProfile;
import com.example.graduationproject.repository.UserDetailRepository;
import com.example.graduationproject.repository.UserProfileRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserProfileServiceImpl implements  UserProfileService{
    private final UserProfileRepository userProfileRepository;
    private final ModelMapper modelMapper;
    private final UserDetailRepository userDetailRepository;

    public UserProfileServiceImpl(UserProfileRepository userProfileRepository, ModelMapper modelMapper, UserDetailRepository userDetailRepository) {
        this.userProfileRepository = userProfileRepository;
        this.modelMapper = modelMapper;
        this.userDetailRepository = userDetailRepository;
    }

    @Override
    public UserProfile createUserProfile(DtoUserProfile dtoUserProfile) {
        UserProfile userProfile = new UserProfile();
        modelMapper.map(dtoUserProfile, userProfile);
        Optional<UserDetail> userDetailOptional = userDetailRepository.findById(dtoUserProfile.getUserId());
        if (userDetailOptional.isPresent()) {
            userProfile.setUserDetail(userDetailOptional.get());
        } else {
            throw new RuntimeException("UserDetail not found for ID: " + dtoUserProfile.getUserId());
        }
        return userProfileRepository.save(userProfile);
    }

    @Override
    public UserProfile updateUserProfile(Integer userProfileId, DtoUserProfile dtoUserProfile) {
        Optional<UserProfile> optionalUserProfile = userProfileRepository.findById(userProfileId);
        if (optionalUserProfile.isPresent()) {
            UserProfile userProfile = optionalUserProfile.get();
            modelMapper.map(dtoUserProfile, userProfile);

            Optional<UserDetail> userDetailOptional = userDetailRepository.findById(dtoUserProfile.getUserProfileId());
            if (userDetailOptional.isPresent()) {
                userProfile.setUserDetail(userDetailOptional.get());
            } else {
                throw new RuntimeException("UserDetail not found for ID: " + dtoUserProfile.getUserProfileId());
            }

            return userProfileRepository.save(userProfile);
        } else {
            // If not found by userProfileId, create a new profile linked to the user
            UserProfile userProfile = new UserProfile();
            modelMapper.map(dtoUserProfile, userProfile);

            Optional<UserDetail> userDetailOptional = userDetailRepository.findById(dtoUserProfile.getUserProfileId());
            if (userDetailOptional.isPresent()) {
                userProfile.setUserDetail(userDetailOptional.get());
            } else {
                throw new RuntimeException("UserDetail not found for ID: " + dtoUserProfile.getUserProfileId());
            }

            return userProfileRepository.save(userProfile);
        }
    }

    @Override
    public List<UserProfile> getAllUserProfile() {
        return (List<UserProfile>) userProfileRepository.findAll();
    }

    @Override
    public Optional<UserProfile> getUserProfileById(Integer userProfileId) {
        return userProfileRepository.findById(userProfileId);
    }

    @Override
    public void deleteUserProfileById(Integer userProfileId) {
        userProfileRepository.deleteById(userProfileId);
    }
}
