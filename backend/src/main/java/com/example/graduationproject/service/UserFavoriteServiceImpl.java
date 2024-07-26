package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoUserFavorites;
import com.example.graduationproject.entities.Meal;
import com.example.graduationproject.entities.UserDetail;
import com.example.graduationproject.entities.UserFavorites;
import com.example.graduationproject.repository.MealRepository;
import com.example.graduationproject.repository.UserDetailRepository;
import com.example.graduationproject.repository.UserFavoriteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.apache.catalina.User;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.relational.core.sql.In;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserFavoriteServiceImpl implements UserFavoriteService {
    @Autowired
    private final UserFavoriteRepository userFavoriteRepository;
    private final UserDetailRepository userDetailRepository;
    private final MealRepository mealRepository;
    private final ModelMapper modelMapper;
    private static final Logger logger = LoggerFactory.getLogger(UserFavoriteService.class);


    public UserFavoriteServiceImpl(UserFavoriteRepository userFavoriteRepository, UserDetailRepository userDetailRepository, MealRepository mealRepository, ModelMapper modelMapper) {
        this.userFavoriteRepository = userFavoriteRepository;
        this.userDetailRepository = userDetailRepository;
        this.mealRepository = mealRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public UserFavorites createUserFavorites(DtoUserFavorites dtoUserFavorites) {
        UserFavorites userFavorites = new UserFavorites();
        modelMapper.map(dtoUserFavorites, userFavorites);
        return userFavoriteRepository.save(userFavorites);
    }

    @Override
    public UserFavorites updateUserFavorites(Integer userFavoritesId, DtoUserFavorites dtoUserFavorites) {
        Optional<UserFavorites> optionalUserFavorites = userFavoriteRepository.findById(userFavoritesId);
        if(optionalUserFavorites.isPresent()){
            UserFavorites userFavorites = optionalUserFavorites.get();
            modelMapper.map(dtoUserFavorites, userFavorites);
            return userFavoriteRepository.save(userFavorites);
        }
        return null;
    }
    @Override
    public DtoUserFavorites addFavorite(DtoUserFavorites favoriteDTO) {
        UserDetail user = userDetailRepository.findById(favoriteDTO.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Meal meal = mealRepository.findById(favoriteDTO.getMealId()).orElseThrow(() -> new RuntimeException("Meal not found"));

        UserFavorites favorite = new UserFavorites();
        favorite.setUserDetail(user);
        favorite.setMeal(meal);

        UserFavorites savedFavorite = userFavoriteRepository.save(favorite);
        favoriteDTO.setUserFavoriteId(savedFavorite.getUserFavoriteID());
        return favoriteDTO;
    }
@Override
    public List<DtoUserFavorites> getFavoritesByUserId(Integer userId) {
        List<UserFavorites> favorites = userFavoriteRepository.findByUserDetailUserId(userId);
        return favorites.stream()
                .map(favorite -> modelMapper.map(favorite, DtoUserFavorites.class))
                .collect(Collectors.toList());
    }

    @Override
    public void addUserFavorite(DtoUserFavorites dtoUserFavorites) {

    }

    @Override
    public List<UserFavorites> getAllUserFavorites() {
        return (List<UserFavorites>) userFavoriteRepository.findAll();
    }

    @Override
    public Optional<UserFavorites> getUserFavoritesById(Integer userFavoriteId) {
        return userFavoriteRepository.findById(userFavoriteId);
    }
    @Override
    public List<UserFavorites> getUserFavoritesByUserId(Integer userId) {
        return userFavoriteRepository.findByUserDetailUserId(userId);
    }
    @Override
    public void removeUserFavorite(Integer userFavoritesID) {
        userFavoriteRepository.deleteById(userFavoritesID);
    }

    @Transactional
    @Override
    public void removeFavorite(Integer userId, Integer mealId) {
        logger.info("Attempting to remove favorite meal with ID {} for user with ID {}", mealId, userId);

        // Find the user favorite record by userId and mealId
        Optional<UserFavorites> userFavorite = userFavoriteRepository.findByUserDetailUserIdAndMealMealId(userId, mealId);

        if (userFavorite.isPresent()) {
            logger.info("Found favorite meal with ID {} for user with ID {}", mealId, userId);

            // Delete the user favorite meal
            userFavoriteRepository.delete(userFavorite.get());
            userFavoriteRepository.flush(); // Ensure changes are persisted immediately

            logger.info("Deleted favorite meal with ID {} for user with ID {}", mealId, userId);
        } else {
            logger.error("Favorite meal with ID {} not found for user with ID {}", mealId, userId);
            throw new EntityNotFoundException("Favorite meal not found"); // Example of a more specific exception
        }
    }

    @Override
    public String loginAndGetToken(String username, String password) {
        return null;
    }

}
