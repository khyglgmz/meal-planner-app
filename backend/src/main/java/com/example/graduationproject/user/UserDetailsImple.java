package com.example.graduationproject.user;

import com.example.graduationproject.entities.UserDetail;
import com.example.graduationproject.repository.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsImple implements UserDetailsService {


    private final UserDetailRepository userDetailRepository;

    public UserDetailsImple(UserDetailRepository userDetailRepository) {
        this.userDetailRepository = userDetailRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDetail userDetail = userDetailRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


        return User.builder()
                .username(userDetail.getUsername())
                .password(userDetail.getPassword())
                .accountExpired(!userDetail.isAccountNonExpired())
                .accountLocked(!userDetail.isAccountNonLocked())
                .credentialsExpired(!userDetail.isCredentialsNonExpired())
                .disabled(!userDetail.isEnabled())
                .build();
    }

}
