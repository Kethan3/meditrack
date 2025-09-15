package com.meditrack.config;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.meditrack.entity.User;
import com.meditrack.repository.UserRepository;

@Configuration
public class DataSeeder {

    @Bean
 CommandLineRunner initAdmin(UserRepository users, PasswordEncoder encoder) {
    	  //    CommandLineRunner initAdmin(UserRepository users) {
        return args -> {
            if (users.findByUsername("admin").isEmpty()) {
                User admin = User.builder()
                        .username("admin")
                        .password(encoder.encode("admin123"))
                        .role("ADMIN")
                        .verified(true)
                        
                        .build();
                users.save(admin);
            }
        };
    }
}
