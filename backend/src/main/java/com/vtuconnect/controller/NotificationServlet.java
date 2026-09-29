package com.vtuconnect.controller;

import com.vtuconnect.dao.NotificationDAO;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.Notification;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/notifications", "/api/notifications/*"})
public class NotificationServlet extends HttpServlet {

    private final NotificationDAO notificationDAO = new NotificationDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long userId = AuthFilter.getAuthenticatedUserId(req);
            if (userId == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated", "UNAUTHORIZED");
                return;
            }

            List<Notification> list = notificationDAO.findByUser(userId);
            JsonUtil.sendSuccess(resp, "Notifications retrieved", list);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
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

            String pathInfo = req.getPathInfo();
            if (pathInfo != null) {
                if ("/read-all".equalsIgnoreCase(pathInfo)) {
                    notificationDAO.markAllAsRead(userId);
                    JsonUtil.sendSuccess(resp, "All notifications marked as read", null);
                    return;
                }

                String[] parts = pathInfo.split("/");
                if (parts.length >= 2) {
                    Long notifId = Long.parseLong(parts[1]);
                    notificationDAO.markAsRead(notifId, userId);
                    JsonUtil.sendSuccess(resp, "Notification marked as read", null);
                    return;
                }
            }

            notificationDAO.markAllAsRead(userId);
            JsonUtil.sendSuccess(resp, "Notifications marked as read", null);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
