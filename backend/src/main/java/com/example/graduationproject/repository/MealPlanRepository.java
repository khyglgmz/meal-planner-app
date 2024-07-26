package com.example.graduationproject.repository;

import com.example.graduationproject.entities.MealPlan;
import com.example.graduationproject.entities.UserDetail;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlan, Integer> {
    List<MealPlan> findByUserDetail(UserDetail userDetail);
    List<MealPlan> findByUserDetailUserIdAndDayOfWeek(Integer userId, Integer dayofWeek);
}