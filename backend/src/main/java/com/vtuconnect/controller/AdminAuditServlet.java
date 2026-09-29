package com.vtuconnect.controller;

import com.vtuconnect.model.AuditLog;
import com.vtuconnect.service.AdminService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/admin/audit-logs"})
public class AdminAuditServlet extends HttpServlet {

    private final AdminService adminService = new AdminService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            int limit = req.getParameter("limit") != null ? Integer.parseInt(req.getParameter("limit")) : 100;
            List<AuditLog> list = adminService.getAuditLogs(limit);
            JsonUtil.sendSuccess(resp, "Audit logs retrieved", list);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
