package com.vtuconnect.controller;

import com.google.gson.JsonObject;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.User;
import com.vtuconnect.service.AdminService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/admin/users", "/api/admin/users/*"})
public class AdminUserServlet extends HttpServlet {

    private final AdminService adminService = new AdminService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            List<User> list = adminService.getAllUsers();
            JsonUtil.sendSuccess(resp, "Users list retrieved", list);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String ip = req.getRemoteAddr();
            String pathInfo = req.getPathInfo();

            if (pathInfo != null) {
                String[] parts = pathInfo.split("/");
                // Format: /api/admin/users/{id}/status
                if (parts.length >= 3 && "status".equalsIgnoreCase(parts[2])) {
                    Long targetUserId = Long.parseLong(parts[1]);
                    JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
                    String status = json.get("status").getAsString().toUpperCase();

                    boolean ok = adminService.updateUserStatus(targetUserId, status, adminId, ip);
                    JsonUtil.sendSuccess(resp, "User status updated to " + status, ok);
                    return;
                }
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid user action endpoint", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
