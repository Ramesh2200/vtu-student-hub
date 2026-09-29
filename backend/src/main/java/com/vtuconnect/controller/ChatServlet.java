package com.vtuconnect.controller;

import com.google.gson.JsonObject;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.ChatMessage;
import com.vtuconnect.model.ChatRoom;
import com.vtuconnect.service.ChatService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/chat/*"})
public class ChatServlet extends HttpServlet {

    private final ChatService chatService = new ChatService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            String pathInfo = req.getPathInfo();

            if (pathInfo == null || "/rooms".equalsIgnoreCase(pathInfo)) {
                // GET /api/chat/rooms
                List<ChatRoom> rooms = chatService.getAllRooms();
                JsonUtil.sendSuccess(resp, "Chat rooms retrieved", rooms);
                return;
            }

            if ("/messages".equalsIgnoreCase(pathInfo)) {
                // GET /api/chat/messages?roomId=1&limit=50&beforeId=100
                String roomParam = req.getParameter("roomId");
                if (roomParam == null || roomParam.isBlank()) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "roomId query parameter is required", "MISSING_PARAM");
                    return;
                }
                Long roomId = Long.parseLong(roomParam);
                int limit = req.getParameter("limit") != null ? Integer.parseInt(req.getParameter("limit")) : 50;
                Long beforeId = req.getParameter("beforeId") != null && !req.getParameter("beforeId").isBlank() ? Long.parseLong(req.getParameter("beforeId")) : null;

                List<ChatMessage> messages = chatService.getRoomMessages(roomId, limit, beforeId);
                JsonUtil.sendSuccess(resp, "Chat messages retrieved", messages);
                return;
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid chat endpoint", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long currentUserId = AuthFilter.getAuthenticatedUserId(req);
            if (currentUserId == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_UNAUTHORIZED, "Please log in to participate in student community chat", "UNAUTHORIZED");
                return;
            }

            String pathInfo = req.getPathInfo();

            if ("/messages".equalsIgnoreCase(pathInfo)) {
                // POST /api/chat/messages
                JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
                if (json == null || !json.has("roomId")) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "roomId is required", "BAD_REQUEST");
                    return;
                }

                String messageText = null;
                if (json.has("message") && !json.get("message").isJsonNull()) {
                    messageText = json.get("message").getAsString();
                } else if (json.has("content") && !json.get("content").isJsonNull()) {
                    messageText = json.get("content").getAsString();
                }

                if (messageText == null || messageText.trim().isEmpty()) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Message text cannot be empty", "BAD_REQUEST");
                    return;
                }

                Long roomId = json.get("roomId").getAsLong();
                boolean isQuestion = json.has("isQuestion") && json.get("isQuestion").getAsBoolean();
                Long replyToId = (json.has("replyToId") && !json.get("replyToId").isJsonNull()) ? json.get("replyToId").getAsLong() : null;

                ChatMessage created = chatService.sendMessage(roomId, currentUserId, messageText, isQuestion, replyToId);
                JsonUtil.sendCreated(resp, "Message posted successfully", created);
                return;
            }

            if ("/report".equalsIgnoreCase(pathInfo)) {
                // POST /api/chat/report
                JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
                if (json == null || !json.has("messageId") || !json.has("reason")) {
                    JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "messageId and reason are required", "BAD_REQUEST");
                    return;
                }

                Long messageId = json.get("messageId").getAsLong();
                String reason = json.get("reason").getAsString();

                boolean reported = chatService.reportMessage(messageId, currentUserId, reason);
                JsonUtil.sendSuccess(resp, "Message reported for admin review. Thank you for keeping VTU Connect safe.", reported);
                return;
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid chat action", "BAD_REQUEST");
        } catch (IllegalArgumentException e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage(), "VALIDATION_ERROR");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Chat error: " + e.getMessage(), e.getMessage());
        }
    }
}
