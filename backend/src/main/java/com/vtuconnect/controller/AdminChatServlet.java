package com.vtuconnect.controller;

import com.google.gson.JsonObject;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.MessageReport;
import com.vtuconnect.service.ChatService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/admin/chat/reports", "/api/admin/chat/reports/*"})
public class AdminChatServlet extends HttpServlet {

    private final ChatService chatService = new ChatService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            String status = req.getParameter("status");
            List<MessageReport> list = chatService.getReports(status);
            JsonUtil.sendSuccess(resp, "Message reports retrieved", list);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            String pathInfo = req.getPathInfo();
            if (pathInfo != null) {
                String[] parts = pathInfo.split("/");
                // Pattern: /{reportId}/review
                if (parts.length >= 2) {
                    Long reportId = Long.parseLong(parts[1]);
                    JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);

                    String status = json.has("status") ? json.get("status").getAsString() : "ACTIONED";
                    String adminNotes = json.has("adminNotes") ? json.get("adminNotes").getAsString() : "";
                    boolean deleteMessage = json.has("deleteMessage") && json.get("deleteMessage").getAsBoolean();

                    boolean ok = chatService.reviewReport(reportId, status, adminNotes, deleteMessage);
                    JsonUtil.sendSuccess(resp, "Report review saved successfully", ok);
                    return;
                }
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Report ID required", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
