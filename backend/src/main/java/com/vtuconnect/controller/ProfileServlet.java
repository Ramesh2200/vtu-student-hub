package com.vtuconnect.controller;

import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.Profile;
import com.vtuconnect.model.User;
import com.vtuconnect.service.ProfileService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(urlPatterns = {"/api/profile", "/api/profile/*"})
public class ProfileServlet extends HttpServlet {

    private final ProfileService profileService = new ProfileService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long userId = AuthFilter.getAuthenticatedUserId(req);
            if (userId == null) {
                // If query param userId is specified (for viewing other student profiles)
                String qId = req.getParameter("userId");
                if (qId != null) {
                    try {
                        userId = Long.parseLong(qId);
                    } catch (NumberFormatException ignored) {}
                }
            }

            if (userId == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated", "UNAUTHORIZED");
                return;
            }

            User user = profileService.getFullUserProfile(userId);
            if (user == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_NOT_FOUND, "User profile not found", "NOT_FOUND");
                return;
            }

            JsonUtil.sendSuccess(resp, "Profile fetched successfully", user);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to fetch profile: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long userId = AuthFilter.getAuthenticatedUserId(req);
            if (userId == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated", "UNAUTHORIZED");
                return;
            }

            Profile profileUpdate = JsonUtil.parseRequestBody(req, Profile.class);
            if (profileUpdate == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Profile data is required", "BAD_REQUEST");
                return;
            }

            Profile updated = profileService.updateProfile(userId, profileUpdate);
            JsonUtil.sendSuccess(resp, "Profile updated successfully", updated);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to update profile: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Support POST as create/update profile
        doPut(req, resp);
    }
}
