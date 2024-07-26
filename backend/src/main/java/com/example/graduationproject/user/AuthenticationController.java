package com.example.graduationproject.user;

import com.example.graduationproject.dataTransferObjects.DtoRegistration;
import com.example.graduationproject.entities.UserDetail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class AuthenticationController {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    private final AuthenticationService authService;

    public AuthenticationController(AuthenticationService authService) {
        this.authService = authService;
    }
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody DtoRegistration request){
        return ResponseEntity.ok(authService.register(request));
    }
    @PostMapping(value = "/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody DtoLogin  request){
        logger.debug("Received login request for username: {}", request.getUsername());

        return ResponseEntity.ok(authService.authenticate(request));
    }
}
