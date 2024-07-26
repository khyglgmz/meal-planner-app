package com.example.graduationproject.controller;

import com.example.graduationproject.dataTransferObjects.DtoUserDetail;
import com.example.graduationproject.entities.UserDetail;
import com.example.graduationproject.service.UserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@CrossOrigin(origins = "http://localhost:8081")
@RequestMapping(value = "/api/user")
public class UserDetailController {

    @Autowired
    private final UserDetailService userDetailService;


    public UserDetailController(UserDetailService userDetailService) {
        this.userDetailService = userDetailService;
    }

    @PostMapping("/create")
    public ResponseEntity<UserDetail> createUserDetail(@RequestBody DtoUserDetail dtoUserDetail) {
        UserDetail createdUser = userDetailService.createUserDetail(dtoUserDetail);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<UserDetail> updateUserDetail(
            @PathVariable Integer userId,
            @RequestBody DtoUserDetail dtoUserDetail
    ) {
        UserDetail updatedUser = userDetailService.updateUserDetail(userId, dtoUserDetail);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<UserDetail>> getAllUserDetails() {
        List<UserDetail> userDetails = userDetailService.getAllUserDetails();
        return ResponseEntity.ok(userDetails);
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<UserDetail> getUserDetailById(@PathVariable Integer userId) {
        Optional<UserDetail> userDetail = userDetailService.getUserDetailById(userId);
        return userDetail.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Void> deleteUserDetailById(@PathVariable Integer userId) {
        userDetailService.deleteUserDetailById(userId);
        return ResponseEntity.noContent().build();
    }

}

