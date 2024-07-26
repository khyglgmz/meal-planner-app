package com.example.graduationproject.controller;

import com.example.graduationproject.dataTransferObjects.DtoUserProfile;
import com.example.graduationproject.entities.UserProfile;
import com.example.graduationproject.service.UserProfileService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/user-profile")
public class UserProfileController {
    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }
    @GetMapping(value = "/getAll")
    public List<UserProfile> getAllUserProfiles() {
        return userProfileService.getAllUserProfile();
    }
    @GetMapping(value = "/get/{userProfileId}")
    public Optional<UserProfile> getUserProfileById(@PathVariable Integer userProfileId) {
        return userProfileService.getUserProfileById(userProfileId);
    }
    @PostMapping(value = "/create")
    public UserProfile createUserProfile(@RequestBody DtoUserProfile dtoUserProfile) {
        return userProfileService.createUserProfile(dtoUserProfile);
    }
    @PutMapping(value = "/update/{userProfileId}")
    public UserProfile updateUserProfile(@PathVariable Integer userProfileId, @RequestBody DtoUserProfile dtoUserProfile) {
        return userProfileService.updateUserProfile(userProfileId,dtoUserProfile);
    }
    @DeleteMapping(value = "/delete/{userProfileId}")
    public void deleteUserProfile(@PathVariable Integer userProfileId) {
        userProfileService.deleteUserProfileById(userProfileId);
    }

}
