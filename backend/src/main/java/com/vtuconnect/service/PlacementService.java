package com.vtuconnect.service;

import com.vtuconnect.dao.PlacementDAO;
import com.vtuconnect.model.Placement;
import com.vtuconnect.model.PlacementApplication;

import java.sql.SQLException;
import java.util.List;

public class PlacementService {

    private final PlacementDAO placementDAO = new PlacementDAO();

    public List<Placement> getPlacements(String status, String batch, String query, Long currentUserId) throws SQLException {
        return placementDAO.findFiltered(status, batch, query, currentUserId);
    }

    public Placement getPlacementById(Long id, Long currentUserId) throws SQLException {
        return placementDAO.findById(id, currentUserId);
    }

    public boolean applyToPlacement(Long placementId, Long userId, String resumeLink, String notes) throws SQLException {
        return placementDAO.apply(placementId, userId, resumeLink, notes);
    }

    public String getLatestResumeByUser(Long userId) throws SQLException {
        return placementDAO.getLatestResumeByUser(userId);
    }

    public List<PlacementApplication> getStudentApplications(Long userId) throws SQLException {
        return placementDAO.findApplicationsByUser(userId);
    }

    public List<PlacementApplication> getPlacementApplicants(Long placementId) throws SQLException {
        return placementDAO.findApplicationsByPlacement(placementId);
    }

    public boolean updateApplicationStatus(Long applicationId, String status) throws SQLException {
        return placementDAO.updateApplicationStatus(applicationId, status);
    }
}
