package com.vtuconnect.service;

import com.vtuconnect.dao.ChatDAO;
import com.vtuconnect.model.ChatMessage;
import com.vtuconnect.model.ChatRoom;
import com.vtuconnect.model.MessageReport;
import com.vtuconnect.util.ValidationUtil;

import java.sql.SQLException;
import java.util.List;

public class ChatService {

    private final ChatDAO chatDAO = new ChatDAO();

    public List<ChatRoom> getAllRooms() throws SQLException {
        return chatDAO.findAllRooms();
    }

    public List<ChatMessage> getRoomMessages(Long roomId, int limit, Long beforeId) throws SQLException {
        return chatDAO.findMessagesByRoom(roomId, limit, beforeId);
    }

    public ChatMessage sendMessage(Long roomId, Long userId, String message, boolean isQuestion, Long replyToId) throws Exception {
        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("Message text cannot be empty");
        }
        String cleanMessage = ValidationUtil.sanitize(message);
        ChatMessage msg = new ChatMessage();
        msg.setRoomId(roomId);
        msg.setUserId(userId);
        msg.setMessage(cleanMessage);
        msg.setQuestion(isQuestion);
        msg.setReplyToId(replyToId);

        return chatDAO.createMessage(msg);
    }

    public boolean reportMessage(Long messageId, Long reportedBy, String reason) throws SQLException {
        return chatDAO.reportMessage(messageId, reportedBy, reason);
    }

    public List<MessageReport> getReports(String status) throws SQLException {
        return chatDAO.findAllReports(status);
    }

    public boolean reviewReport(Long reportId, String status, String adminNotes, boolean deleteMessage) throws SQLException {
        return chatDAO.updateReportStatus(reportId, status, adminNotes, deleteMessage);
    }
}
