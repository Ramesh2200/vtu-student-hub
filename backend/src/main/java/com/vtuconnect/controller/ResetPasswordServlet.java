package com.vtuconnect.controller;

import com.google.gson.JsonObject;
import com.vtuconnect.service.AuthService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(urlPatterns = {"/api/auth/forgot-password", "/api/auth/reset-password"})
public class ResetPasswordServlet extends HttpServlet {

    private final AuthService authService = new AuthService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
            if (json == null || !json.has("email") || !json.has("newPassword")) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Email and new password are required", "INVALID_REQUEST");
                return;
            }

            String email = json.get("email").getAsString();
            String newPassword = json.get("newPassword").getAsString();

            boolean success = authService.resetPassword(email, newPassword);
            if (success) {
                JsonUtil.sendSuccess(resp, "Password updated successfully. You can now log in with your new credentials.", null);
            } else {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Failed to update password for the specified email.", "RESET_FAILED");
            }
        } catch (IllegalArgumentException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage(), "VALIDATION_ERROR");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error: " + e.getMessage(), "SERVER_ERROR");
        }
    }
}
