package com.vtuconnect.util;

import java.util.regex.Pattern;

/**
 * Validation and sanitization utility.
 */
public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final Pattern USN_PATTERN = Pattern.compile("^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$", Pattern.CASE_INSENSITIVE);

    public static boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) return false;
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static boolean isValidUSN(String usn) {
        if (usn == null || usn.isBlank()) return false;
        return USN_PATTERN.matcher(usn.trim()).matches();
    }

    public static boolean isStrongPassword(String password) {
        if (password == null || password.length() < 6) return false;
        return true;
    }

    public static String sanitize(String input) {
        if (input == null) return null;
        return input.trim()
                .replace("<script>", "")
                .replace("</script>", "")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
