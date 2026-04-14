package com.buytheway.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;

public class SupabaseJwtUtil {

    public static String extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        DecodedJWT jwt = JWT.decode(token);

        return jwt.getSubject(); // Supabase user id (UUID string)
    }
}