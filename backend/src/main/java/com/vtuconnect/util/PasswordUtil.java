package com.vtuconnect.util;

import org.mindrot.jbcrypt.BCrypt;

/**
 * Utility for hashing and verifying passwords securely using BCrypt.
 * Passwords are never stored in plaintext.
 */
public class PasswordUtil {

    /**
     * Hashes a plaintext password using BCrypt with salt rounds (default 10).
     */
    public static String hashPassword(String plainPassword) {
        if (plainPassword == null || plainPassword.isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt(10));
    }

    /**
     * Verifies that a plaintext candidate password matches the BCrypt hash.
     */
    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        if (plainPassword == null || hashedPassword == null) {
            return false;
        }
        try {
            return BCrypt.checkpw(plainPassword, hashedPassword);
        } catch (Exception e) {
            return false;
        }
    }
}
