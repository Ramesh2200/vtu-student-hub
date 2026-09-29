package com.vtuconnect.service;

import com.vtuconnect.dao.ProfileDAO;
import com.vtuconnect.dao.UserDAO;
import com.vtuconnect.model.Profile;
import com.vtuconnect.model.User;

import java.sql.SQLException;

public class ProfileService {

    private final ProfileDAO profileDAO = new ProfileDAO();
    private final UserDAO userDAO = new UserDAO();

    public Profile getProfileByUserId(Long userId) throws SQLException {
        return profileDAO.findByUserId(userId);
    }

    public Profile updateProfile(Long userId, Profile p) throws SQLException {
        p.setUserId(userId);
        return profileDAO.saveOrUpdate(p);
    }

    public User getFullUserProfile(Long userId) throws SQLException {
        return userDAO.findById(userId);
    }
}
