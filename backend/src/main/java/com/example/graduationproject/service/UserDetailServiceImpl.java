package com.example.graduationproject.service;

import com.example.graduationproject.dataTransferObjects.DtoUserDetail;
import com.example.graduationproject.entities.UserDetail;
import com.example.graduationproject.repository.UserDetailRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
@Transactional
@Service
public class UserDetailServiceImpl implements UserDetailService{
    @Autowired
    private final UserDetailRepository userDetailRepository;

    private final ModelMapper modelMapper;

    public UserDetailServiceImpl(UserDetailRepository userDetailRepository, ModelMapper modelMapper) {
        this.userDetailRepository = userDetailRepository;
        this.modelMapper = modelMapper;
    }


    @Override
    public UserDetail createUserDetail(DtoUserDetail dtoUserDetail) {
        UserDetail userDetail = new UserDetail();
        modelMapper.map(dtoUserDetail, userDetail);
        return userDetailRepository.save(userDetail);
    }

    @Override
    public UserDetail updateUserDetail(Integer userId, DtoUserDetail dtoUserDetail) {
        Optional<UserDetail> optionalUserDetail = userDetailRepository.findById(userId);
        if(optionalUserDetail.isPresent()){
            UserDetail userDetail = optionalUserDetail.get();
            modelMapper.map(dtoUserDetail, userDetail);
            return userDetailRepository.save(userDetail);
        }
        return null;
    }

    @Override
    public List<UserDetail> getAllUserDetails() {
        return (List<UserDetail>) userDetailRepository.findAll();
    }

    @Override
    public Optional<UserDetail> getUserDetailById(Integer userId) {
        return userDetailRepository.findById(userId);
    }

    @Override
    public void deleteUserDetailById(Integer userId) {
        userDetailRepository.deleteById(userId);
    }


    public UserDetail authenticateUser(String username, String password) {
        Optional<UserDetail> optionalUserDetail = userDetailRepository.findByUsernameAndPassword(username, password);

        // Check if userDetail is present in Optional
        if (optionalUserDetail.isPresent()) {
            return optionalUserDetail.get();
        } else {
            return null; // Or throw an exception, handle as needed
        }
    }

    @Override
    public UserDetail findByUsername(String username) {
        return userDetailRepository.findByUsername(username).orElse(null);
    }

    @Override
    public UserDetail findById(Integer userId) {
        return userDetailRepository.findById(userId).orElse(null);
    }
}

