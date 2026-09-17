// SkillMap AI - Global Authentication & Session Context
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle as firebaseLoginWithGoogle,
  logoutUser
} from "../services/firebase";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("skillmap_token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    async function initSession() {
      const savedToken = localStorage.getItem("skillmap_token");
      const savedUser = localStorage.getItem("skillmap_user");

      if (savedToken) {
        try {
          const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${savedToken}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.authenticated && data.user) {
              setUserProfile(data.user);
              setCurrentUser({
                uid: data.user.firebase_uid,
                email: data.user.email,
                displayName: data.user.name
              });
              setToken(savedToken);
            }
          } else {
            // Token expired or invalid
            localStorage.removeItem("skillmap_token");
            localStorage.removeItem("skillmap_user");
            setToken(null);
            setUserProfile(null);
            setCurrentUser(null);
          }
        } catch (err) {
          console.warn("Backend auth check error:", err);
          if (savedUser) {
            try {
              const u = JSON.parse(savedUser);
              setUserProfile(u);
              setCurrentUser({ uid: u.firebase_uid, email: u.email, displayName: u.name });
            } catch (e) {}
          }
        }
      }
      setLoading(false);
    }

    initSession();
  }, []);

  const clearError = () => setError(null);

  /**
   * Log in existing user
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const fbResult = await loginWithEmail(email, password);
      
      // Synchronize with FastAPI backend
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fbResult.user.email,
          firebase_uid: fbResult.user.uid,
          name: fbResult.user.displayName
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Authentication synchronization failed with SkillMap server.");
      }

      const data = await res.json();
      const sessionToken = data.token || fbResult.token;
      
      localStorage.setItem("skillmap_token", sessionToken);
      localStorage.setItem("skillmap_user", JSON.stringify(data.user));

      setToken(sessionToken);
      setCurrentUser(fbResult.user);
      setUserProfile(data.user);
      return data.user;
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Failed to log in. Please check your credentials.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user (Zero password persistence in backend DB)
   */
  const register = async (name, email, password, careerGoal) => {
    setLoading(true);
    setError(null);
    try {
      const fbResult = await registerWithEmail(email, password, name);

      // Register profile in FastAPI backend (never send password)
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Student Learner",
          email: fbResult.user.email,
          firebase_uid: fbResult.user.uid,
          career_goal: careerGoal || "Full Stack Developer"
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Profile registration failed on SkillMap server.");
      }

      const data = await res.json();
      const sessionToken = data.token || fbResult.token;

      localStorage.setItem("skillmap_token", sessionToken);
      localStorage.setItem("skillmap_user", JSON.stringify(data.user));

      setToken(sessionToken);
      setCurrentUser(fbResult.user);
      setUserProfile(data.user);
      return data.user;
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.message || "Failed to create account. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google OAuth Login
   */
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const fbResult = await firebaseLoginWithGoogle();

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fbResult.user.email,
          firebase_uid: fbResult.user.uid,
          name: fbResult.user.displayName
        })
      });

      let profileData;
      if (res.ok) {
        const d = await res.json();
        profileData = d.user;
        localStorage.setItem("skillmap_token", d.token);
        setToken(d.token);
      } else {
        profileData = {
          id: 99,
          firebase_uid: fbResult.user.uid,
          name: fbResult.user.displayName,
          email: fbResult.user.email,
          career_goal: "Full Stack Developer",
          avatar_url: fbResult.user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
          level: 3,
          level_title: "Explorer",
          xp: 2400,
          xp_max: 5000
        };
        const mockToken = "google_token_" + Date.now();
        localStorage.setItem("skillmap_token", mockToken);
        setToken(mockToken);
      }

      localStorage.setItem("skillmap_user", JSON.stringify(profileData));
      setCurrentUser(fbResult.user);
      setUserProfile(profileData);
      return profileData;
    } catch (err) {
      console.error("Google login failed:", err);
      setError(err.message || "Google sign-in failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 1-Click Demo Quick Login
   */
  const demoLogin = async (preset = "rajat") => {
    setLoading(true);
    setError(null);
    let mockProfile;

    if (preset === "rajat") {
      mockProfile = {
        id: 1,
        firebase_uid: "uid_rajat_demo",
        name: "Rajat Verma",
        email: "rajat.verma@example.edu",
        career_goal: "Full Stack Developer",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        level: 4,
        level_title: "Builder",
        xp: 4820,
        xp_max: 6000,
        streak_days: 12,
        identity_verified: true
      };
    } else if (preset === "rahul") {
      mockProfile = {
        id: 2,
        firebase_uid: "uid_rahul_demo",
        name: "Rahul Sharma",
        email: "rahul.sharma@example.edu",
        career_goal: "AI/ML Engineer",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        level: 2,
        level_title: "Apprentice",
        xp: 1540,
        xp_max: 3000,
        streak_days: 5,
        identity_verified: false
      };
    } else {
      mockProfile = {
        id: 3,
        firebase_uid: "uid_recruiter_demo",
        name: "Sarah Jenkins",
        email: "sarah.recruiter@hiretech.io",
        career_goal: "Technical Recruiter",
        avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
        level: 5,
        level_title: "Talent Scout",
        xp: 7200,
        xp_max: 10000,
        streak_days: 24,
        identity_verified: true
      };
    }

    try {
      // Sync with backend
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: mockProfile.email,
          firebase_uid: mockProfile.firebase_uid,
          name: mockProfile.name
        })
      });
      if (res.ok) {
        const d = await res.json();
        mockProfile = d.user;
        const mockToken = d.token || ("demo_token_" + Date.now());
        localStorage.setItem("skillmap_token", mockToken);
        setToken(mockToken);
      } else {
        const mockToken = "demo_token_" + Date.now();
        localStorage.setItem("skillmap_token", mockToken);
        setToken(mockToken);
      }
    } catch (e) {
      const mockToken = "demo_token_" + Date.now();
      localStorage.setItem("skillmap_token", mockToken);
      setToken(mockToken);
    }

    localStorage.setItem("skillmap_user", JSON.stringify(mockProfile));
    setCurrentUser({
      uid: mockProfile.firebase_uid,
      email: mockProfile.email,
      displayName: mockProfile.name
    });
    setUserProfile(mockProfile);
    setLoading(false);
    return mockProfile;
  };

  /**
   * Log out student and redirect to Login
   */
  const logout = async () => {
    try {
      await logoutUser();
      await fetch(`${API_BASE}/api/auth/logout`, { method: "POST" }).catch(() => {});
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      localStorage.removeItem("skillmap_token");
      localStorage.removeItem("skillmap_user");
      setToken(null);
      setCurrentUser(null);
      setUserProfile(null);
      setError(null);
    }
  };

  const value = {
    currentUser,
    userProfile,
    isAuthenticated: !!token && !!userProfile,
    loading,
    error,
    clearError,
    login,
    register,
    loginWithGoogle,
    demoLogin,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
