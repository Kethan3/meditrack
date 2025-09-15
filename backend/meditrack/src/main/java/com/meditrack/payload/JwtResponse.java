
package com.meditrack.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class JwtResponse {
    private String token;
    private String username;
    private String role;
    private Long userId;
}

