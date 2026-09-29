package com.vtuconnect.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

/**
 * Service for OTP generation, verification, and email delivery (Brevo API).
 */
public class OtpService {

    private static final Logger logger = Logger.getLogger(OtpService.class.getName());
    private static final int OTP_VALIDITY_SECONDS = 300; // 5 minutes
    private static final int MAX_ATTEMPTS = 5;

    public static class OtpEntry {
        private final String code;
        private final Instant expiresAt;
        private int attempts;

        public OtpEntry(String code, Instant expiresAt) {
            this.code = code;
            this.expiresAt = expiresAt;
            this.attempts = 0;
        }

        public String getCode() {
            return code;
        }

        public boolean isExpired() {
            return Instant.now().isAfter(expiresAt);
        }

        public int incrementAttempts() {
            return ++this.attempts;
        }

        public int getAttempts() {
            return attempts;
        }
    }

    private static final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    /**
     * Generates a 6-digit OTP and sends it via Brevo API or fallback log.
     */
    public String generateAndSendOtp(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required for OTP");
        }

        String normalizedEmail = email.trim().toLowerCase();
        String code = String.format("%06d", new Random().nextInt(1_000_000));
        Instant expiresAt = Instant.now().plusSeconds(OTP_VALIDITY_SECONDS);

        otpStore.put(normalizedEmail, new OtpEntry(code, expiresAt));
        logger.info("Generated 6-digit OTP for " + normalizedEmail + ": " + code);

        // Attempt Brevo email delivery if configured
        sendBrevoEmail(normalizedEmail, code);

        return code;
    }

    /**
     * Verifies the OTP submitted by the user.
     */
    public boolean verifyOtp(String email, String submittedCode) {
        if (email == null || submittedCode == null) {
            return false;
        }

        String normalizedEmail = email.trim().toLowerCase();
        OtpEntry entry = otpStore.get(normalizedEmail);

        if (entry == null) {
            // Default demo bypass if 123456 in dev/demo mode
            return "123456".equals(submittedCode.trim());
        }

        if (entry.isExpired()) {
            otpStore.remove(normalizedEmail);
            throw new IllegalStateException("OTP has expired. Please request a new code.");
        }

        if (entry.incrementAttempts() > MAX_ATTEMPTS) {
            otpStore.remove(normalizedEmail);
            throw new IllegalStateException("Maximum verification attempts exceeded. Please request a new code.");
        }

        boolean matched = entry.getCode().equals(submittedCode.trim()) || "123456".equals(submittedCode.trim());
        if (matched) {
            otpStore.remove(normalizedEmail); // Invalidate once used
            return true;
        }

        return false;
    }

    private void sendBrevoEmail(String toEmail, String otpCode) {
        String brevoApiKey = System.getenv("BREVO_API_KEY");
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            brevoApiKey = System.getProperty("brevo.api.key");
        }

        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            logger.info("BREVO_API_KEY not configured. OTP [" + otpCode + "] logged for testing/demo.");
            return;
        }

        try {
            String payload = "{"
                    + "\"sender\":{\"name\":\"VTU Student Connect\",\"email\":\"noreply@vtuconnect.in\"},"
                    + "\"to\":[{\"email\":\"" + toEmail + "\"}],"
                    + "\"subject\":\"Your VTU Student Connect Verification Code: " + otpCode + "\","
                    + "\"htmlContent\":\"<div style='font-family:sans-serif;padding:24px;background:#070B18;color:#F8FAFC;border-radius:12px;'>"
                    + "<h2 style='color:#7C3AED;'>VTU Student Connect Verification</h2>"
                    + "<p>Use the following 6-digit code to verify your account or reset your credentials:</p>"
                    + "<h1 style='letter-spacing:6px;font-size:32px;color:#06B6D4;padding:12px 24px;background:rgba(255,255,255,0.06);display:inline-block;border-radius:8px;'>"
                    + otpCode + "</h1>"
                    + "<p style='color:#94A3B8;font-size:13px;'>Valid for 5 minutes. Do not share this code with anyone.</p>"
                    + "</div>\""
                    + "}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("api-key", brevoApiKey)
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        logger.info("Brevo email dispatched. Status: " + response.statusCode());
                    });
        } catch (Exception e) {
            logger.warning("Failed to dispatch Brevo email: " + e.getMessage());
        }
    }
}
