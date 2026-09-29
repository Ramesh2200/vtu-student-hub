package com.vtuconnect;

import com.vtuconnect.controller.*;
import com.vtuconnect.filter.AdminFilter;
import com.vtuconnect.filter.AuthFilter;
import com.vtuconnect.filter.CorsFilter;
import jakarta.servlet.DispatcherType;
import org.apache.catalina.Context;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.StandardRoot;
import org.apache.tomcat.util.descriptor.web.FilterDef;
import org.apache.tomcat.util.descriptor.web.FilterMap;

import java.io.File;
import java.util.EnumSet;

/**
 * Turnkey embedded launcher for Apache Tomcat &amp; Jakarta Servlets.
 */
public class Launcher {

    private static final int DEFAULT_PORT = 8080;

    public static void main(String[] args) throws Exception {
        int port = DEFAULT_PORT;
        String portEnv = System.getenv("PORT");
        if (portEnv != null && !portEnv.isBlank()) {
            try {
                port = Integer.parseInt(portEnv.trim());
            } catch (NumberFormatException ignored) {}
        }

        Tomcat tomcat = new Tomcat();
        tomcat.setPort(port);
        tomcat.getConnector(); // Initialize connector

        String baseDir = new File(System.getProperty("java.io.tmpdir"), "tomcat-vtu-connect").getAbsolutePath();
        tomcat.setBaseDir(baseDir);

        File webappDir = new File("src/main/webapp");
        if (!webappDir.exists()) {
            webappDir = new File("backend/src/main/webapp");
        }
        if (!webappDir.exists()) {
            webappDir = new File(".");
        }

        Context ctx = tomcat.addContext("", webappDir.getAbsolutePath());
        ctx.setParentClassLoader(Launcher.class.getClassLoader());
        ctx.setAllowCasualMultipartParsing(true);

        // Add compiled classes to resource set
        File additionWebInfClasses = new File("target/classes");
        if (!additionWebInfClasses.exists()) {
            additionWebInfClasses = new File("backend/target/classes");
        }
        if (additionWebInfClasses.exists()) {
            StandardRoot resources = new StandardRoot(ctx);
            resources.addPreResources(new DirResourceSet(resources, "/WEB-INF/classes",
                    additionWebInfClasses.getAbsolutePath(), "/"));
            ctx.setResources(resources);
        }

        // Register Filters programmatically
        FilterDef corsFilterDef = new FilterDef();
        corsFilterDef.setFilterName("CorsFilter");
        corsFilterDef.setFilterClass(CorsFilter.class.getName());
        ctx.addFilterDef(corsFilterDef);

        FilterMap corsFilterMap = new FilterMap();
        corsFilterMap.setFilterName("CorsFilter");
        corsFilterMap.addURLPattern("/*");
        ctx.addFilterMap(corsFilterMap);

        FilterDef authFilterDef = new FilterDef();
        authFilterDef.setFilterName("AuthFilter");
        authFilterDef.setFilterClass(AuthFilter.class.getName());
        ctx.addFilterDef(authFilterDef);

        FilterMap authFilterMap = new FilterMap();
        authFilterMap.setFilterName("AuthFilter");
        authFilterMap.addURLPattern("/api/profile/*");
        authFilterMap.addURLPattern("/api/bookmarks/*");
        authFilterMap.addURLPattern("/api/downloads/*");
        ctx.addFilterMap(authFilterMap);

        FilterDef adminFilterDef = new FilterDef();
        adminFilterDef.setFilterName("AdminFilter");
        adminFilterDef.setFilterClass(AdminFilter.class.getName());
        ctx.addFilterDef(adminFilterDef);

        FilterMap adminFilterMap = new FilterMap();
        adminFilterMap.setFilterName("AdminFilter");
        adminFilterMap.addURLPattern("/api/admin/*");
        ctx.addFilterMap(adminFilterMap);

        // Register Servlets programmatically
        Tomcat.addServlet(ctx, "LoginServlet", new LoginServlet());
        ctx.addServletMappingDecoded("/api/auth/login", "LoginServlet");

        Tomcat.addServlet(ctx, "RegisterServlet", new RegisterServlet());
        ctx.addServletMappingDecoded("/api/auth/register", "RegisterServlet");

        Tomcat.addServlet(ctx, "OtpServlet", new OtpServlet());
        ctx.addServletMappingDecoded("/api/auth/send-otp", "OtpServlet");
        ctx.addServletMappingDecoded("/api/auth/verify-otp", "OtpServlet");

        Tomcat.addServlet(ctx, "ResetPasswordServlet", new ResetPasswordServlet());
        ctx.addServletMappingDecoded("/api/auth/forgot-password", "ResetPasswordServlet");
        ctx.addServletMappingDecoded("/api/auth/reset-password", "ResetPasswordServlet");

        Tomcat.addServlet(ctx, "LogoutServlet", new LogoutServlet());
        ctx.addServletMappingDecoded("/api/auth/logout", "LogoutServlet");

        Tomcat.addServlet(ctx, "ProfileServlet", new ProfileServlet());
        ctx.addServletMappingDecoded("/api/profile", "ProfileServlet");
        ctx.addServletMappingDecoded("/api/profile/*", "ProfileServlet");

        Tomcat.addServlet(ctx, "SemesterServlet", new SemesterServlet());
        ctx.addServletMappingDecoded("/api/semesters", "SemesterServlet");
        ctx.addServletMappingDecoded("/api/semesters/*", "SemesterServlet");

        Tomcat.addServlet(ctx, "SubjectServlet", new SubjectServlet());
        ctx.addServletMappingDecoded("/api/subjects", "SubjectServlet");
        ctx.addServletMappingDecoded("/api/subjects/*", "SubjectServlet");

        Tomcat.addServlet(ctx, "NotesServlet", new NotesServlet());
        ctx.addServletMappingDecoded("/api/notes", "NotesServlet");
        ctx.addServletMappingDecoded("/api/notes/*", "NotesServlet");

        Tomcat.addServlet(ctx, "QuestionBankServlet", new QuestionBankServlet());
        ctx.addServletMappingDecoded("/api/question-banks", "QuestionBankServlet");
        ctx.addServletMappingDecoded("/api/question-banks/*", "QuestionBankServlet");

        Tomcat.addServlet(ctx, "PreviousPaperServlet", new PreviousPaperServlet());
        ctx.addServletMappingDecoded("/api/previous-papers", "PreviousPaperServlet");
        ctx.addServletMappingDecoded("/api/previous-papers/*", "PreviousPaperServlet");

        Tomcat.addServlet(ctx, "PlacementServlet", new PlacementServlet());
        ctx.addServletMappingDecoded("/api/placements", "PlacementServlet");
        ctx.addServletMappingDecoded("/api/placements/*", "PlacementServlet");

        Tomcat.addServlet(ctx, "ChatServlet", new ChatServlet());
        ctx.addServletMappingDecoded("/api/chat/*", "ChatServlet");

        Tomcat.addServlet(ctx, "AdvertisementServlet", new AdvertisementServlet());
        ctx.addServletMappingDecoded("/api/advertisements", "AdvertisementServlet");
        ctx.addServletMappingDecoded("/api/advertisements/*", "AdvertisementServlet");

        Tomcat.addServlet(ctx, "NotificationServlet", new NotificationServlet());
        ctx.addServletMappingDecoded("/api/notifications", "NotificationServlet");
        ctx.addServletMappingDecoded("/api/notifications/*", "NotificationServlet");

        Tomcat.addServlet(ctx, "AnnouncementServlet", new AnnouncementServlet());
        ctx.addServletMappingDecoded("/api/announcements", "AnnouncementServlet");
        ctx.addServletMappingDecoded("/api/announcements/*", "AnnouncementServlet");

        Tomcat.addServlet(ctx, "BookmarkServlet", new BookmarkServlet());
        ctx.addServletMappingDecoded("/api/bookmarks", "BookmarkServlet");
        ctx.addServletMappingDecoded("/api/bookmarks/*", "BookmarkServlet");

        Tomcat.addServlet(ctx, "DownloadServlet", new DownloadServlet());
        ctx.addServletMappingDecoded("/api/downloads", "DownloadServlet");
        ctx.addServletMappingDecoded("/api/downloads/*", "DownloadServlet");

        Tomcat.addServlet(ctx, "GlobalSearchServlet", new GlobalSearchServlet());
        ctx.addServletMappingDecoded("/api/search", "GlobalSearchServlet");

        // Admin Servlets
        Tomcat.addServlet(ctx, "AdminDashboardServlet", new AdminDashboardServlet());
        ctx.addServletMappingDecoded("/api/admin/stats", "AdminDashboardServlet");

        Tomcat.addServlet(ctx, "AdminNotesServlet", new AdminNotesServlet());
        ctx.addServletMappingDecoded("/api/admin/notes", "AdminNotesServlet");
        ctx.addServletMappingDecoded("/api/admin/notes/*", "AdminNotesServlet");

        Tomcat.addServlet(ctx, "AdminQuestionBankServlet", new AdminQuestionBankServlet());
        ctx.addServletMappingDecoded("/api/admin/question-banks", "AdminQuestionBankServlet");
        ctx.addServletMappingDecoded("/api/admin/question-banks/*", "AdminQuestionBankServlet");

        Tomcat.addServlet(ctx, "AdminPreviousPaperServlet", new AdminPreviousPaperServlet());
        ctx.addServletMappingDecoded("/api/admin/previous-papers", "AdminPreviousPaperServlet");
        ctx.addServletMappingDecoded("/api/admin/previous-papers/*", "AdminPreviousPaperServlet");

        Tomcat.addServlet(ctx, "AdminPlacementServlet", new AdminPlacementServlet());
        ctx.addServletMappingDecoded("/api/admin/placements", "AdminPlacementServlet");
        ctx.addServletMappingDecoded("/api/admin/placements/*", "AdminPlacementServlet");

        Tomcat.addServlet(ctx, "AdminAdvertisementServlet", new AdminAdvertisementServlet());
        ctx.addServletMappingDecoded("/api/admin/advertisements", "AdminAdvertisementServlet");
        ctx.addServletMappingDecoded("/api/admin/advertisements/*", "AdminAdvertisementServlet");

        Tomcat.addServlet(ctx, "AdminAnnouncementServlet", new AdminAnnouncementServlet());
        ctx.addServletMappingDecoded("/api/admin/announcements", "AdminAnnouncementServlet");
        ctx.addServletMappingDecoded("/api/admin/announcements/*", "AdminAnnouncementServlet");

        Tomcat.addServlet(ctx, "AdminUserServlet", new AdminUserServlet());
        ctx.addServletMappingDecoded("/api/admin/users", "AdminUserServlet");
        ctx.addServletMappingDecoded("/api/admin/users/*", "AdminUserServlet");

        Tomcat.addServlet(ctx, "AdminChatServlet", new AdminChatServlet());
        ctx.addServletMappingDecoded("/api/admin/chat/reports", "AdminChatServlet");
        ctx.addServletMappingDecoded("/api/admin/chat/reports/*", "AdminChatServlet");

        Tomcat.addServlet(ctx, "AdminAuditServlet", new AdminAuditServlet());
        ctx.addServletMappingDecoded("/api/admin/audit-logs", "AdminAuditServlet");

        Tomcat.addServlet(ctx, "AdminSemesterServlet", new AdminSemesterServlet());
        ctx.addServletMappingDecoded("/api/admin/semesters", "AdminSemesterServlet");
        ctx.addServletMappingDecoded("/api/admin/semesters/*", "AdminSemesterServlet");

        Tomcat.addServlet(ctx, "AdminSubjectServlet", new AdminSubjectServlet());
        ctx.addServletMappingDecoded("/api/admin/subjects", "AdminSubjectServlet");
        ctx.addServletMappingDecoded("/api/admin/subjects/*", "AdminSubjectServlet");

        System.out.println("==================================================================");
        System.out.println("   STUDENT CONNECT - VTU STUDENT CONNECT BACKEND (TOMCAT 10)     ");
        System.out.println("   Architecture: React UI -> Jakarta Servlets -> DAO -> MySQL    ");
        System.out.println("   Server running on http://localhost:" + port + "/api           ");
        System.out.println("==================================================================");

        tomcat.start();
        tomcat.getServer().await();
    }
}
