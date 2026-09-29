package com.vtuconnect.model;

import java.sql.Timestamp;

public class ChatMessage {
    private Long id;
    private Long roomId;
    private Long userId;
    private String message;
    private boolean question;
    private Long replyToId;
    private boolean moderated;
    private boolean deleted;
    private Timestamp createdAt;

    // Join fields
    private String userName;
    private String userRole;
    private String userAvatar;
    private String replyMessage;
    private String replyUserName;

    public ChatMessage() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isQuestion() { return question; }
    public void setQuestion(boolean question) { this.question = question; }

    public Long getReplyToId() { return replyToId; }
    public void setReplyToId(Long replyToId) { this.replyToId = replyToId; }

    public boolean isModerated() { return moderated; }
    public void setModerated(boolean moderated) { this.moderated = moderated; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getUserAvatar() { return userAvatar; }
    public void setUserAvatar(String userAvatar) { this.userAvatar = userAvatar; }

    public String getReplyMessage() { return replyMessage; }
    public void setReplyMessage(String replyMessage) { this.replyMessage = replyMessage; }

    public String getReplyUserName() { return replyUserName; }
    public void setReplyUserName(String replyUserName) { this.replyUserName = replyUserName; }
}
