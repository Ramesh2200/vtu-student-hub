package com.vtuconnect.model;

/**
 * Standard unified API Response envelope for all endpoints.
 */
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;
    private String error;

    public ApiResponse() {}

    public ApiResponse(boolean success, String message, Object data, String error) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
    }

    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(true, message, data, null);
    }

    public static ApiResponse error(String message, String error) {
        return new ApiResponse(false, message, null, error);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
