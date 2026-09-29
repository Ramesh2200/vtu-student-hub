package com.vtuconnect.controller;

import com.google.gson.JsonObject;
import com.vtuconnect.model.User;
import com.vtuconnect.service.AuthService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/auth/register")
public class RegisterServlet extends HttpServlet {

    private final AuthService authService = new AuthService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
            if (json == null || !json.has("email") || !json.has("password") || !json.has("fullName")) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Email, password, and full name are required", "INVALID_REQUEST");
                return;
            }

            String email = json.get("email").getAsString();
            String password = json.get("password").getAsString();
            String fullName = json.get("fullName").getAsString();
            String usn = json.has("usn") && !json.get("usn").isJsonNull() ? json.get("usn").getAsString() : null;
            String college = json.has("college") && !json.get("college").isJsonNull() ? json.get("college").getAsString() : null;
            String branch = json.has("branch") && !json.get("branch").isJsonNull() ? json.get("branch").getAsString() : null;
            int semester = json.has("semester") && !json.get("semester").isJsonNull() ? json.get("semester").getAsInt() : 1;

            User user = authService.register(email, password, fullName, usn, college, branch, semester);

            // Establish session
            HttpSession session = req.getSession(true);
            session.setAttribute("USER_ID", user.getId());
            session.setAttribute("USER_EMAIL", user.getEmail());
            session.setAttribute("USER_ROLE", user.getRole());

            Map<String, Object> data = new HashMap<>();
            data.put("user", user);
            data.put("token", "uid-" + user.getId());
            data.put("role", user.getRole());

            JsonUtil.sendCreated(resp, "Account registered successfully", data);
        } catch (IllegalArgumentException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage(), "VALIDATION_ERROR");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Registration failed: " + e.getMessage(), e.getMessage());
        }
    }
}
