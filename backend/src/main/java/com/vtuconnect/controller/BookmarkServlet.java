package com.vtuconnect.controller;

import com.google.gson.JsonObject;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.Bookmark;
import com.vtuconnect.service.ResourceService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(urlPatterns = {"/api/bookmarks", "/api/bookmarks/*"})
public class BookmarkServlet extends HttpServlet {

    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long userId = AuthFilter.getAuthenticatedUserId(req);
            if (userId == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated", "UNAUTHORIZED");
                return;
            }

            List<Bookmark> list = resourceService.getUserBookmarks(userId);
            JsonUtil.sendSuccess(resp, "Bookmarks retrieved", list);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long userId = AuthFilter.getAuthenticatedUserId(req);
            if (userId == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated", "UNAUTHORIZED");
                return;
            }

            JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
            if (json == null || !json.has("resourceType") || !json.has("resourceId")) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "resourceType and resourceId required", "BAD_REQUEST");
                return;
            }

            String resourceType = json.get("resourceType").getAsString().toUpperCase();
            Long resourceId = json.get("resourceId").getAsLong();

            boolean isBookmarked = resourceService.toggleBookmark(userId, resourceType, resourceId);

            Map<String, Object> data = new HashMap<>();
            data.put("bookmarked", isBookmarked);
            data.put("resourceType", resourceType);
            data.put("resourceId", resourceId);

            JsonUtil.sendSuccess(resp, isBookmarked ? "Resource bookmarked" : "Resource removed from bookmarks", data);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
