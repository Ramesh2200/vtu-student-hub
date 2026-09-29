package com.vtuconnect.controller;

import com.vtuconnect.dao.AnnouncementDAO;
import com.vtuconnect.model.Announcement;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/announcements", "/api/announcements/*"})
public class AnnouncementServlet extends HttpServlet {

    private final AnnouncementDAO announcementDAO = new AnnouncementDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            List<Announcement> list = announcementDAO.findActive();
            JsonUtil.sendSuccess(resp, "Announcements retrieved", list);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }
}
