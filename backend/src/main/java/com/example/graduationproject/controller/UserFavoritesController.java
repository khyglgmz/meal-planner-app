package com.example.graduationproject.controller;

import com.example.graduationproject.dataTransferObjects.DtoUserFavorites;
import com.example.graduationproject.entities.UserFavorites;
import com.example.graduationproject.service.UserDetailService;
import com.example.graduationproject.service.UserFavoriteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8081")
@RequestMapping("/api/favorites")
public class UserFavoritesController {
    private static final Logger logger = LoggerFactory.getLogger(UserFavoritesController.class);

    private final UserFavoriteService userFavoriteService;

    public UserFavoritesController(UserFavoriteService userFavoriteService) {
        this.userFavoriteService = userFavoriteService;
    }
    @GetMapping(value = "/get")
    public List<UserFavorites> getAllUserFavorites(){
        return userFavoriteService.getAllUserFavorites();

    }

    @PostMapping("/add")
    public DtoUserFavorites addFavorite(@RequestBody DtoUserFavorites favoriteDTO) {
        return userFavoriteService.addFavorite(favoriteDTO);
    }

    @GetMapping("/user/{userId}")
    public List<DtoUserFavorites> getFavoritesByUserId(@PathVariable Integer userId) {
        return userFavoriteService.getFavoritesByUserId(userId);
    }
    @DeleteMapping("/remove/{userId}/{mealId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Integer userId, @PathVariable Integer mealId) {
        try {
            logger.info("Request to remove favorite meal with ID {} for user with ID {}", mealId, userId);
            userFavoriteService.removeFavorite(userId, mealId);
            logger.info("Successfully removed favorite meal with ID {} for user with ID {}", mealId, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            logger.error("Error removing favorite meal: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error removing favorite meal: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @DeleteMapping(value = "/remove/{userFavoritesID}")
    public void removeUserFavorite(@PathVariable Integer userFavoritesID) {
        userFavoriteService.removeUserFavorite(userFavoritesID);
    }
}
