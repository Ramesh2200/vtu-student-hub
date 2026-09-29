package com.vtuconnect.controller;

import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.Semester;
import com.vtuconnect.service.AdminService;
import com.vtuconnect.service.ResourceService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/admin/semesters", "/api/admin/semesters/*"})
public class AdminSemesterServlet extends HttpServlet {

    private final AdminService adminService = new AdminService();
    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            List<Semester> list = adminService.getAllSemestersAdmin();
            JsonUtil.sendSuccess(resp, "Semesters retrieved", list);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String ip = req.getRemoteAddr();

            Semester s = JsonUtil.parseRequestBody(req, Semester.class);
            if (s == null || s.getName() == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Semester details required", "BAD_REQUEST");
                return;
            }

            Semester created = adminService.createSemester(s, adminId, ip);
            JsonUtil.sendCreated(resp, "Semester created successfully", created);
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
                if (parts.length >= 2) {
                    int id = Integer.parseInt(parts[1]);

                    // Check if status toggle: /api/admin/semesters/{id}/status
                    if (parts.length >= 3 && "status".equalsIgnoreCase(parts[2])) {
                        Semester s = JsonUtil.parseRequestBody(req, Semester.class);
                        boolean active = s != null && s.isActive();
                        boolean ok = adminService.toggleSemesterActive(id, active, adminId, ip);
                        JsonUtil.sendSuccess(resp, "Semester status updated successfully", ok);
                        return;
                    }

                    Semester s = JsonUtil.parseRequestBody(req, Semester.class);
                    s.setId(id);

                    boolean ok = adminService.updateSemester(s, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Semester updated successfully", ok);
                    return;
                }
            }
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Semester ID required", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String ip = req.getRemoteAddr();
            String pathInfo = req.getPathInfo();

            if (pathInfo != null) {
                String[] parts = pathInfo.split("/");
                if (parts.length >= 2) {
                    int id = Integer.parseInt(parts[1]);
                    boolean ok = adminService.deleteSemester(id, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Semester deleted successfully", ok);
                    return;
                }
            }
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Semester ID required", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
