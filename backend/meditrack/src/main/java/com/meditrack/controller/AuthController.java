
package com.meditrack.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meditrack.entity.User;
import com.meditrack.payload.JwtResponse;
import com.meditrack.payload.LoginRequest;
import com.meditrack.payload.SignupRequest;
import com.meditrack.repository.PatientRepository;
import com.meditrack.repository.UserRepository;
import com.meditrack.security.JwtUtils;
import com.meditrack.security.UserDetailsImpl;
import com.meditrack.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;
    
    
    @Autowired // Spring will inject an instance here
    private UserRepository userRepository; 
    
    @Autowired
    private PatientRepository patientRepository;
    
    
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signup")
    public User register(@Valid @RequestBody SignupRequest signupRequest) {
        return authService.register(signupRequest);
    }

    @PostMapping("/login")
    public JwtResponse login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication.getName());
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // 🔑 Extra check for doctor verification
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        
        

        if ("DOCTOR".equalsIgnoreCase(user.getRole()) && !user.isVerified()) {
            throw new RuntimeException("Doctor account not verified by Admin yet.");
        }

        return new JwtResponse(
                jwt,
                userDetails.getUsername(),
                user.getRole(),
                user.getId()
        );
    }
}