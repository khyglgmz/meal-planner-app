package com.example.graduationproject.repository;

import com.example.graduationproject.entities.UserDetail;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDetailRepository extends JpaRepository<UserDetail, Integer> {
    Optional<UserDetail> findByUsername(String username);
    Optional<UserDetail> findByUsernameAndPassword(String username, String password);
    Optional<UserDetail> findByUserId(Integer userId);

}
