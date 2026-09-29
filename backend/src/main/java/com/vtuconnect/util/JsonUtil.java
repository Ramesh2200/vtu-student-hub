package com.vtuconnect.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.vtuconnect.model.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;

/**
 * Utility for parsing and serializing JSON payloads using Google Gson.
 */
public class JsonUtil {

    private static final Gson GSON = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
            .serializeNulls()
            .create();

    public static Gson getGson() {
        return GSON;
    }

    public static String toJson(Object obj) {
        return GSON.toJson(obj);
    }

    public static <T> T fromJson(String json, Class<T> classOfT) throws JsonSyntaxException {
        return GSON.fromJson(json, classOfT);
    }

    public static <T> T parseRequestBody(HttpServletRequest request, Class<T> classOfT) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        String body = sb.toString().trim();
        if (body.isEmpty()) {
            return null;
        }
        return fromJson(body, classOfT);
    }

    public static void sendResponse(HttpServletResponse response, int statusCode, ApiResponse apiResponse) throws IOException {
        response.setStatus(statusCode);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GSON.toJson(apiResponse));
        response.getWriter().flush();
    }

    public static void sendSuccess(HttpServletResponse response, String message, Object data) throws IOException {
        sendResponse(response, HttpServletResponse.SC_OK, ApiResponse.success(message, data));
    }

    public static void sendCreated(HttpServletResponse response, String message, Object data) throws IOException {
        sendResponse(response, HttpServletResponse.SC_CREATED, ApiResponse.success(message, data));
    }

    public static void sendError(HttpServletResponse response, int statusCode, String message, String error) throws IOException {
        sendResponse(response, statusCode, ApiResponse.error(message, error));
    }
}
