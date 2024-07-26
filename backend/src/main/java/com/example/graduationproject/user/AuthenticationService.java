package com.example.graduationproject.user;

import com.example.graduationproject.dataTransferObjects.DtoRegistration;
import com.example.graduationproject.entities.UserDetail;
import com.example.graduationproject.entities.UserProfile;
import com.example.graduationproject.repository.UserDetailRepository;
import com.example.graduationproject.repository.UserProfileRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;


@Service
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    private final UserDetailRepository userDetailRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserDetailRepository userDetailRepository, UserProfileRepository userProfileRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userDetailRepository = userDetailRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }
@Transactional
    public AuthenticationResponse register(DtoRegistration request){
        UserDetail user = new UserDetail();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setGender(request.getGender());

        user = userDetailRepository.save(user);

        UserProfile userProfile = new UserProfile();
        userProfile.setAge(request.getAge());
        userProfile.setHeight(request.getHeight());
        userProfile.setWeight(request.getWeight());
        userProfile.setActivityLevel(request.getActivityLevel());
        userProfile.setHealthGoals(request.getHealthGoals());
        userProfile.setHealthGoals(request.getHealthGoals());
        userProfile.setGender(request.getGender());
        userProfile.setUserDetail(user);

        userProfileRepository.save(userProfile);

        user.setUserProfile(userProfile);
        userDetailRepository.save(user);

        String token = jwtService.generateToken(user);

        return  new AuthenticationResponse(token, user.getUserId());
    }
    @Transactional
    public AuthenticationResponse authenticate(DtoLogin request) {
        try {
            logger.debug("Authenticating user: {}", request.getUsername());

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            UserDetail user = userDetailRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("username not found"));

            logger.debug("User authenticated: {}", user.getUsername());

            String token = jwtService.generateToken(user);
            return new AuthenticationResponse(token, user.getUserId());
        } catch (Exception e) {
            logger.error("Authentication failed for user: {}", request.getUsername(), e);
            throw e;
        }
    }
}
