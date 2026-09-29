package com.vtuconnect.filter;

import com.vtuconnect.util.JsonUtil;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebFilter(urlPatterns = {"/api/profile/*", "/api/bookmarks/*", "/api/downloads/*"})
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) {}

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(req, res);
            return;
        }

        Long userId = getAuthenticatedUserId(request);
        if (userId == null) {
            JsonUtil.sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized. Please log in to access this resource.", "UNAUTHORIZED");
            return;
        }

        chain.doFilter(req, res);
    }

    public static Long getAuthenticatedUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("USER_ID") != null) {
            return (Long) session.getAttribute("USER_ID");
        }

        // Support Authorization / X-User-Id header for REST API clients / tokens
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null && !userIdHeader.isBlank()) {
            try {
                return Long.parseLong(userIdHeader.trim());
            } catch (NumberFormatException ignored) {}
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            if (token.startsWith("uid-")) {
                try {
                    return Long.parseLong(token.substring(4));
                } catch (NumberFormatException ignored) {}
            }
        }

        return null;
    }

    public static String getAuthenticatedUserRole(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("USER_ROLE") != null) {
            return (String) session.getAttribute("USER_ROLE");
        }
        String roleHeader = request.getHeader("X-User-Role");
        if (roleHeader != null && !roleHeader.isBlank()) {
            return roleHeader.trim().toUpperCase();
        }
        return null;
    }

    @Override
    public void destroy() {}
}
