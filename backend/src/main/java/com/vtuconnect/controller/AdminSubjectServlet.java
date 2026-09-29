package com.vtuconnect.controller;

import com.google.gson.JsonObject;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.model.Subject;
import com.vtuconnect.service.AdminService;
import com.vtuconnect.service.ResourceService;
import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/admin/subjects", "/api/admin/subjects/*"})
public class AdminSubjectServlet extends HttpServlet {

    private final AdminService adminService = new AdminService();
    private final ResourceService resourceService = new ResourceService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            List<Subject> list = resourceService.getAllSubjects();
            JsonUtil.sendSuccess(resp, "All subjects retrieved", list);
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage(), e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Long adminId = AuthFilter.getAuthenticatedUserId(req);
            String ip = req.getRemoteAddr();

            JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
            if (json == null) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Subject code and name are required", "BAD_REQUEST");
                return;
            }

            String code = json.has("subjectCode") && !json.get("subjectCode").isJsonNull()
                    ? json.get("subjectCode").getAsString()
                    : (json.has("code") && !json.get("code").isJsonNull() ? json.get("code").getAsString() : null);

            String name = json.has("subjectName") && !json.get("subjectName").isJsonNull()
                    ? json.get("subjectName").getAsString()
                    : (json.has("name") && !json.get("name").isJsonNull()
                        ? json.get("name").getAsString()
                        : (json.has("title") && !json.get("title").isJsonNull() ? json.get("title").getAsString() : null));

            if (code == null || code.isBlank() || name == null || name.isBlank()) {
                JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Subject code and name are required", "BAD_REQUEST");
                return;
            }

            Subject s = new Subject();
            s.setSubjectCode(code.trim().toUpperCase());
            s.setSubjectName(name.trim());

            int semesterId = json.has("semesterId") && !json.get("semesterId").isJsonNull() ? json.get("semesterId").getAsInt() : 1;
            s.setSemesterId(semesterId > 0 ? semesterId : 1);

            String branch = json.has("branch") && !json.get("branch").isJsonNull()
                    ? json.get("branch").getAsString()
                    : (json.has("department") && !json.get("department").isJsonNull() ? json.get("department").getAsString() : "CSE");
            s.setBranch(branch != null && !branch.isBlank() ? branch.trim() : "CSE");

            int credits = json.has("credits") && !json.get("credits").isJsonNull() ? json.get("credits").getAsInt() : 4;
            s.setCredits(credits);

            String desc = json.has("description") && !json.get("description").isJsonNull() ? json.get("description").getAsString() : "";
            s.setDescription(desc);

            String scheme = json.has("scheme") && !json.get("scheme").isJsonNull() ? json.get("scheme").getAsString() : "2022 Scheme CBCS";
            s.setScheme(scheme);
            s.setActive(true);

            Subject created = adminService.createSubject(s, adminId, ip);
            JsonUtil.sendCreated(resp, "Subject created successfully", created);
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
                    JsonObject json = JsonUtil.parseRequestBody(req, JsonObject.class);
                    if (json == null) {
                        JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid update payload", "BAD_REQUEST");
                        return;
                    }

                    String code = json.has("subjectCode") && !json.get("subjectCode").isJsonNull()
                            ? json.get("subjectCode").getAsString()
                            : (json.has("code") && !json.get("code").isJsonNull() ? json.get("code").getAsString() : null);

                    String name = json.has("subjectName") && !json.get("subjectName").isJsonNull()
                            ? json.get("subjectName").getAsString()
                            : (json.has("name") && !json.get("name").isJsonNull()
                                ? json.get("name").getAsString()
                                : (json.has("title") && !json.get("title").isJsonNull() ? json.get("title").getAsString() : null));

                    Subject s = new Subject();
                    s.setId(id);
                    if (code != null && !code.isBlank()) s.setSubjectCode(code.trim().toUpperCase());
                    if (name != null && !name.isBlank()) s.setSubjectName(name.trim());
                    if (json.has("semesterId") && !json.get("semesterId").isJsonNull()) s.setSemesterId(json.get("semesterId").getAsInt());
                    if (json.has("credits") && !json.get("credits").isJsonNull()) s.setCredits(json.get("credits").getAsInt());
                    if (json.has("branch") && !json.get("branch").isJsonNull()) s.setBranch(json.get("branch").getAsString());
                    if (json.has("department") && !json.get("department").isJsonNull()) s.setDepartment(json.get("department").getAsString());
                    if (json.has("description") && !json.get("description").isJsonNull()) s.setDescription(json.get("description").getAsString());

                    boolean ok = adminService.updateSubject(s, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Subject updated successfully", ok);
                    return;
                }
            }
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Subject ID required", "BAD_REQUEST");
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
                    boolean ok = adminService.deleteSubject(id, adminId, ip);
                    JsonUtil.sendSuccess(resp, "Subject deleted successfully", ok);
                    return;
                }
            }
            JsonUtil.sendError(resp, HttpServletResponse.SC_BAD_REQUEST, "Subject ID required", "BAD_REQUEST");
        } catch (Exception e) {
            JsonUtil.sendError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Delete error: " + e.getMessage(), e.getMessage());
        }
    }
}
