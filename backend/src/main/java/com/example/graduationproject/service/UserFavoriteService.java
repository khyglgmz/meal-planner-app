package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoUserFavorites;
import com.example.graduationproject.entities.UserFavorites;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public interface UserFavoriteService {
    public UserFavorites createUserFavorites(DtoUserFavorites dtoUserFavorites);
    public UserFavorites updateUserFavorites(Integer userFavoritesId, DtoUserFavorites dtoUserFavorites);

    public List<UserFavorites> getAllUserFavorites();
    public Optional<UserFavorites> getUserFavoritesById(Integer userFavoriteId);
    public DtoUserFavorites addFavorite(DtoUserFavorites favoriteDTO);
    public List<DtoUserFavorites> getFavoritesByUserId(Integer userId);
    public void addUserFavorite(DtoUserFavorites dtoUserFavorites);
    public List<UserFavorites> getUserFavoritesByUserId(Integer userId);
    public void removeUserFavorite(Integer userFavoritesID);
    public void removeFavorite(Integer userId, Integer mealId);
    public String loginAndGetToken(String username, String password);

}
