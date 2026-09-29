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

@WebServlet("/api/auth/login")
public class LoginServlet extends HttpServlet {

    private final AuthService authService = new AuthService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
            if (json == null || !json.has("email") || !json.has("password")) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Email and password are required", "INVALID_REQUEST");
                return;
            }

            String email = json.get("email").getAsString();
            String password = json.get("password").getAsString();

            User user = authService.login(email, password);

            // Create HTTP Session
            HttpSession session = req.getSession(true);
            session.setAttribute("USER_ID", user.getId());
            session.setAttribute("USER_EMAIL", user.getEmail());
            session.setAttribute("USER_ROLE", user.getRole());

            Map<String, Object> data = new HashMap<>();
            data.put("user", user);
            data.put("token", "uid-" + user.getId());
            data.put("role", user.getRole());

            JsonUtil.sendSuccess(resp, "Login successful", data);
        } catch (IllegalArgumentException | IllegalStateException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, e.getMessage(), "AUTH_FAILED");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An internal server error occurred", e.getMessage());
        }
    }
}
