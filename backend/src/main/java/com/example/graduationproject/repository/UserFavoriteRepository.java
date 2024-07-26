package com.example.graduationproject.repository;

import com.example.graduationproject.entities.UserFavorites;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorites, Integer> {
    List<UserFavorites> findByUserDetailUserId(Integer userId);

    Optional<UserFavorites> findByUserDetailUserIdAndMealMealId(Integer userId, Integer mealId);
    void deleteByUserFavoriteID(Integer userFavoriteId);
}
