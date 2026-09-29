package com.vtuconnect.controller;

import com.vtuconnect.dao.AdvertisementDAO;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.Advertisement;
import com.vtuconnect.service.AdminService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/admin/advertisements", "/api/admin/advertisements/*"})
public class AdminAdvertisementServlet extends HttpServlet {

    private final AdminService adminService = new AdminService();
    private final AdvertisementDAO advertisementDAO = new AdvertisementDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            List<Advertisement> list = advertisementDAO.findAll();
            JsonUtil.sendSuccess(resp, "All advertisements retrieved", list);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String ip = req.getRemoteAddr();

            Advertisement ad = JsonUtil.parseRequestBody(req, Advertisement.class);
            if (ad == null || ad.getTitle() == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Ad title and details required", "BAD_REQUEST");
                return;
            }

            Advertisement created = adminService.createAd(ad, adminId, ip);
            JsonUtil.sendCreated(resp, "Advertisement created successfully", created);
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
                    Long id = Long.parseLong(parts[1]);
                    Advertisement ad = JsonUtil.parseRequestBody(req, Advertisement.class);
                    ad.setId(id);

                    boolean ok = adminService.updateAd(ad, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Advertisement updated successfully", ok);
                    return;
                }
            }
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Ad ID required", "BAD_REQUEST");
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
                    Long id = Long.parseLong(parts[1]);
                    boolean ok = adminService.deleteAd(id, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Advertisement deleted successfully", ok);
                    return;
                }
            }
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Ad ID required", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
