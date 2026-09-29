package com.vtuconnect.controller;

import com.google.gson.JsonObject;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.Placement;
import com.vtuconnect.model.PlacementApplication;
import com.vtuconnect.service.AdminService;
import com.vtuconnect.service.PlacementService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/admin/placements", "/api/admin/placements/*"})
public class AdminPlacementServlet extends HttpServlet {

    private final AdminService adminService = new AdminService();
    private final PlacementService placementService = new PlacementService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String pathInfo = req.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/") || pathInfo.isEmpty()) {
                List<Placement> list = placementService.getPlacements(null, null, null, adminId);
                JsonUtil.sendSuccess(resp, "All placements retrieved", list);
                return;
            }

            String[] parts = pathInfo.split("/");
            if (parts.length >= 2) {
                Long placementId = Long.parseLong(parts[1]);

                // Check if applicants: /api/admin/placements/{id}/applicants
                if (parts.length >= 3 && "applicants".equalsIgnoreCase(parts[2])) {
                    List<PlacementApplication> apps = placementService.getPlacementApplicants(placementId);
                    JsonUtil.sendSuccess(resp, "Applicants retrieved", apps);
                    return;
                }

                Placement p = placementService.getPlacementById(placementId, adminId);
                JsonUtil.sendSuccess(resp, "Placement retrieved", p);
                return;
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid path", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String ip = req.getRemoteAddr();

            Placement p = JsonUtil.parseRequestBody(req, Placement.class);
            if (p == null || p.getCompanyName() == null || p.getJobRole() == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Company and job role are required", "BAD_REQUEST");
                return;
            }

            Placement created = adminService.createPlacement(p, adminId, ip);
            JsonUtil.sendCreated(resp, "Placement drive created successfully", created);
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
                // Update applicant status: /api/admin/placements/applications/{appId}/status
                if (parts.length >= 4 && "applications".equalsIgnoreCase(parts[1]) && "status".equalsIgnoreCase(parts[3])) {
                    Long appId = Long.parseLong(parts[2]);
                    JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
                    String status = json.get("status").getAsString();
                    placementService.updateApplicationStatus(appId, status);
                    JsonUtil.sendSuccess(resp, "Application status updated to " + status, null);
                    return;
                }

                if (parts.length >= 2) {
                    Long id = Long.parseLong(parts[1]);
                    Placement p = JsonUtil.parseRequestBody(req, Placement.class);
                    p.setId(id);

                    boolean ok = adminService.updatePlacement(p, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Placement drive updated successfully", ok);
                    return;
                }
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Placement ID required", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Update error: " + e.getMessage(), e.getMessage());
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
                    Long id = Long.parseLong(parts[1]);
                    boolean ok = adminService.deletePlacement(id, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Placement drive deleted successfully", ok);
                    return;
                }
            }

            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Placement ID required", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Delete error: " + e.getMessage(), e.getMessage());
        }
    }
}
