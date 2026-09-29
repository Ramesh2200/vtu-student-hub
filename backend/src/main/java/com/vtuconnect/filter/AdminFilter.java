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

import java.io.IOException;

@WebFilter(urlPatterns = {"/api/admin/*"})
public class AdminFilter implements Filter {

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

        Long userId = AuthFilter.getAuthenticatedUserId(request);
        String role = AuthFilter.getAuthenticatedUserRole(request);

        if (userId == null) {
            JsonUtil.sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Admin authentication required. Please log in as administrator.", "UNAUTHORIZED");
            return;
        }

        if (role == null || !"ADMIN".equalsIgnoreCase(role)) {
            JsonUtil.sendError(response, HttpServletResponse.SC_FORBIDDEN, "Access denied. Administrator privileges required to perform this action.", "FORBIDDEN");
            return;
        }

        chain.doFilter(req, res);
    }

    @Override
    public void destroy() {}
}
