package com.vtuconnect.controller;

import com.vtuconnect.dao.AdvertisementDAO;
import com.vtuconnect.model.Advertisement;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/advertisements", "/api/advertisements/*"})
public class AdvertisementServlet extends HttpServlet {

    private final AdvertisementDAO advertisementDAO = new AdvertisementDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            List<Advertisement> activeAds = advertisementDAO.findActive();
            JsonUtil.sendSuccess(resp, "Active advertisements retrieved", activeAds);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            // POST /api/advertisements/{id}/click to track clicks
            String pathInfo = req.getPathInfo();
            if (pathInfo != null) {
                String[] parts = pathInfo.split("/");
                if (parts.length >= 3 && "click".equalsIgnoreCase(parts[2])) {
                    Long adId = Long.parseLong(parts[1]);
                    advertisementDAO.incrementClicks(adId);
                    JsonUtil.sendSuccess(resp, "Click recorded", null);
                    return;
                }
            }
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid ad action", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
