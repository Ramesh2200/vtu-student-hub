import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USER,
  FACULTY_USER,
  ADMIN_USER,
  SUBJECTS_6TH_SEM,
  MOCK_NOTES,
  MOCK_QUESTION_PAPERS,
  MOCK_DISCUSSIONS,
  MOCK_EVENTS,
  MOCK_JOBS,
  MOCK_STUDY_GROUPS,
  MOCK_NOTIFICATIONS,
  COLLEGES,
  BRANCHES,
  SCHEMES
} from '../data/mockData';
import { authApi } from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Session / Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vtu_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('vtu_is_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('vtu_is_auth') === 'true' ? 'dashboard' : 'home';
  });

  // Modals & Panels
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [pdfViewerData, setPdfViewerData] = useState(null); // { title, subject, pages, author, contentSnippet }
  const [globalSearch, setGlobalSearch] = useState('');

  // Domain data with local persistence
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('vtu_notes');
    return saved ? JSON.parse(saved) : MOCK_NOTES;
  });

  const [questionPapers, setQuestionPapers] = useState(() => {
    const saved = localStorage.getItem('vtu_qps');
    return saved ? JSON.parse(saved) : MOCK_QUESTION_PAPERS;
  });

  const [discussions, setDiscussions] = useState(() => {
    const saved = localStorage.getItem('vtu_discussions');
    return saved ? JSON.parse(saved) : MOCK_DISCUSSIONS;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('vtu_events');
    return saved ? JSON.parse(saved) : MOCK_EVENTS;
  });

  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('vtu_jobs');
    return saved ? JSON.parse(saved) : MOCK_JOBS;
  });

  const [studyGroups, setStudyGroups] = useState(() => {
    const saved = localStorage.getItem('vtu_groups');
    return saved ? JSON.parse(saved) : MOCK_STUDY_GROUPS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('vtu_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('vtu_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('vtu_is_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('vtu_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('vtu_discussions', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('vtu_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('vtu_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('vtu_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth actions
  const loginUser = (userType = 'student', customData = null) => {
    let target = INITIAL_USER;
    if (userType === 'faculty') target = FACULTY_USER;
    if (userType === 'admin') target = ADMIN_USER;
    if (customData) target = { ...target, ...customData };
    
    setCurrentUser(target);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    
    if (userType === 'admin') {
      setActiveTab('admin');
    } else if (userType === 'faculty') {
      setActiveTab('faculty');
    } else {
      setActiveTab('dashboard');
    }
  };

  const logoutUser = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setActiveTab('home');
    setShowNotificationsPanel(false);
  };

  const switchRole = (role) => {
    if (role === 'admin') {
      setCurrentUser(ADMIN_USER);
      setActiveTab('admin');
    } else if (role === 'faculty') {
      setCurrentUser(FACULTY_USER);
      setActiveTab('faculty');
    } else {
      setCurrentUser(INITIAL_USER);
      setActiveTab('dashboard');
    }
  };

  // Notes actions
  const toggleBookmarkNote = (noteId) => {
    setNotes(prev => prev.map(item => {
      if (item.id === noteId) {
        const next = !item.isBookmarked;
        return {
          ...item,
          isBookmarked: next,
          bookmarks: next ? item.bookmarks + 1 : Math.max(0, item.bookmarks - 1)
        };
      }
      return item;
    }));
  };

  const addNote = (newNote) => {
    setNotes(prev => [newNote, ...prev]);
    // Push a notification
    addNotification({
      category: 'Academic',
      title: `New Note Uploaded: ${newNote.title}`,
      description: `Uploaded by ${newNote.author} for ${newNote.subjectCode}`,
      actionUrl: '#notes'
    });
  };

  // Discussions actions
  const upvoteDiscussion = (discId) => {
    setDiscussions(prev => prev.map(item => {
      if (item.id === discId) {
        const next = !item.hasUpvoted;
        return {
          ...item,
          hasUpvoted: next,
          upvotes: next ? item.upvotes + 1 : item.upvotes - 1
        };
      }
      return item;
    }));
  };

  const addDiscussion = (newQuestion) => {
    setDiscussions(prev => [newQuestion, ...prev]);
  };

  const addAnswer = (discId, answerText) => {
    setDiscussions(prev => prev.map(item => {
      if (item.id === discId) {
        const newAns = {
          author: currentUser.name,
          authorRole: currentUser.role === 'student' ? `Student (${currentUser.branchCode})` : 'Faculty Member',
          authorAvatar: currentUser.avatar,
          timestamp: 'Just now',
          content: answerText,
          upvotes: 1
        };
        return {
          ...item,
          answersCount: item.answersCount + 1,
          acceptedAnswer: item.acceptedAnswer || newAns
        };
      }
      return item;
    }));
  };

  // Events actions
  const toggleRegisterEvent = (eventId) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        const registered = !evt.registered;
        return {
          ...evt,
          registered,
          spotsLeft: registered ? evt.spotsLeft - 1 : evt.spotsLeft + 1
        };
      }
      return evt;
    }));
  };

  // Placement & Kanban actions
  const updateJobStatus = (jobId, newStatus) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: newStatus,
          appliedDate: newStatus !== 'Saved' && !job.appliedDate ? new Date().toISOString().slice(0, 10) : job.appliedDate
        };
      }
      return job;
    }));
  };

  // Study Groups actions
  const toggleJoinGroup = (groupId) => {
    setStudyGroups(prev => prev.map(grp => {
      if (grp.id === groupId) {
        const isMember = !grp.isMember;
        return {
          ...grp,
          isMember,
          membersCount: isMember ? grp.membersCount + 1 : grp.membersCount - 1
        };
      }
      return grp;
    }));
  };

  // Notifications actions
  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addNotification = ({ category, title, description, actionUrl }) => {
    const notif = {
      id: `notif_${Date.now()}`,
      category,
      title,
      description,
      timestamp: 'Just now',
      isRead: false,
      actionUrl: actionUrl || '#dashboard'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Profile update
  const updateUserProfile = (updatedFields) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        activeTab,
        setActiveTab,
        showAuthModal,
        setShowAuthModal,
        showOnboardingModal,
        setShowOnboardingModal,
        showNotificationsPanel,
        setShowNotificationsPanel,
        pdfViewerData,
        setPdfViewerData,
        globalSearch,
        setGlobalSearch,
        subjects: SUBJECTS_6TH_SEM,
        notes,
        questionPapers,
        discussions,
        events,
        jobs,
        studyGroups,
        notifications,
        unreadNotificationsCount,
        colleges: COLLEGES,
        branches: BRANCHES,
        schemes: SCHEMES,
        loginUser,
        logoutUser,
        switchRole,
        toggleBookmarkNote,
        addNote,
        upvoteDiscussion,
        addDiscussion,
        addAnswer,
        toggleRegisterEvent,
        updateJobStatus,
        toggleJoinGroup,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        updateUserProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
