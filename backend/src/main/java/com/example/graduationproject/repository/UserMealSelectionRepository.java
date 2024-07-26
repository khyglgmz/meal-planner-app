package com.example.graduationproject.repository;

import com.example.graduationproject.entities.UserMealSelection;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMealSelectionRepository extends CrudRepository<UserMealSelection, Integer> {
}
