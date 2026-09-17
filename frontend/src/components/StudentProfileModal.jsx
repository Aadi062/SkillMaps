// SkillMap AI - Phase 2 Student Profile Foundation Modal
import React, { useState, useEffect } from "react";
import {
  X,
  User,
  GraduationCap,
  Briefcase,
  Compass,
  Award,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Flame,
  Shield,
  MapPin,
  BookOpen
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CAREER_TRACKS = [
  "Full Stack Developer",
  "Software Engineer",
  "AI/ML Engineer",
  "Data Engineer",
  "Cybersecurity Analyst",
  "Cloud & DevOps Engineer"
];

export default function StudentProfileModal({ isOpen, onClose, onProfileUpdated }) {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("academic"); // 'academic', 'career', 'stats'
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [graduationYear, setGraduationYear] = useState(2027);
  const [cgpa, setCgpa] = useState(8.8);
  const [location, setLocation] = useState("");
  const [careerGoal, setCareerGoal] = useState("Full Stack Developer");
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Stats / Competency Cache
  const [stats, setStats] = useState({
    level: 4,
    levelTitle: "Builder",
    xp: 4820,
    xpMax: 6000,
    readinessScore: 82,
    streakDays: 12,
    competencies: {
      problem_solving: 88,
      programming: 92,
      data_analysis: 76,
      creativity: 70,
      communication: 65,
      leadership: 60
    }
  });

  // Load Profile from API on open
  useEffect(() => {
    if (!isOpen) return;

    async function loadProfile() {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      try {
        const token = localStorage.getItem("skillmap_token");
        const res = await fetch(`${API_BASE}/api/users/profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const d = await res.json();
          setName(d.name || userProfile?.name || "Rajat Verma");
          setHeadline(d.headline || "Full Stack & AI Engineer Aspirant");
          setBio(d.bio || "Passionate computer science student building real-world AI and web applications.");
          setCollege(d.college || "Indian Institute of Technology");
          setDegree(d.degree || "B.Tech Computer Science & Engineering");
          setGraduationYear(d.graduation_year || 2027);
          setCgpa(d.cgpa || 8.8);
          setLocation(d.location || "Bengaluru, India");
          setCareerGoal(d.career_goal || "Full Stack Developer");
          setTargetRole(d.target_role || "Full Stack Developer");
          setGithubUrl(d.github_url || "https://github.com/Aadi062");
          setLinkedinUrl(d.linkedin_url || "https://linkedin.com/in/rajat-verma");
          setAvatarUrl(d.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");

          setStats({
            level: d.level || 4,
            levelTitle: d.level_title || "Builder",
            xp: d.xp || 4820,
            xpMax: d.xp_max || 6000,
            readinessScore: d.career_readiness_score || 82,
            streakDays: d.streak_days || 12,
            competencies: d.competencies || {
              problem_solving: 88,
              programming: 92,
              data_analysis: 76,
              creativity: 70,
              communication: 65,
              leadership: 60
            }
          });
        }
      } catch (err) {
        console.warn("Failed to load full profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [isOpen, userProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      name,
      headline,
      bio,
      college,
      degree,
      graduation_year: parseInt(graduationYear) || 2027,
      cgpa: parseFloat(cgpa) || 8.0,
      location,
      career_goal: careerGoal,
      target_role: targetRole,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      avatar_url: avatarUrl
    };

    try {
      const token = localStorage.getItem("skillmap_token");
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to save profile on backend server.");
      }

      const data = await res.json();
      setSuccessMsg("Student profile updated successfully in PostgreSQL/SQLite!");

      if (onProfileUpdated) {
        onProfileUpdated(data.user);
      }

      // Auto clear success after 3 seconds
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800/60 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                alt={name}
                className="w-12 h-12 rounded-full border-2 border-indigo-500/50 object-cover ring-2 ring-indigo-500/20"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{name || "Student Profile"}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                  Level {stats.level} • {stats.levelTitle}
                </span>
              </div>
              <p className="text-xs text-slate-400">{headline}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-300">Readiness:</span>
              <span className="font-bold text-emerald-400">{stats.readinessScore}%</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-5 bg-slate-950/40">
          <button
            onClick={() => setActiveTab("academic")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "academic"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Academic & Degree</span>
          </button>

          <button
            onClick={() => setActiveTab("career")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "career"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Career Preferences & Links</span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "stats"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Verified DNA & XP</span>
          </button>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-slate-200">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <span>Loading student record...</span>
            </div>
          ) : activeTab === "academic" ? (
            <div className="space-y-4">
              {/* Full Name & Headline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. AI & Backend Engineer Aspirant"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* College & Degree */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Indian Institute of Technology"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Degree / Major
                  </label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech in Computer Science"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Graduation Year, CGPA, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Grad Year
                  </label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    CGPA / GPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bengaluru, India"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  About / Student Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your technical interests, projects, and career goals..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          ) : activeTab === "career" ? (
            <div className="space-y-4">
              {/* Career Goal Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Primary Career Track
                </label>
                <select
                  value={careerGoal}
                  onChange={(e) => {
                    setCareerGoal(e.target.value);
                    setTargetRole(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {CAREER_TRACKS.map((track) => (
                    <option key={track} value={track} className="bg-slate-900 text-white">
                      {track}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Role Specification */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Specific Target Job Title
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer / AI Application Developer"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Social URLs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 fill-slate-300" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>GitHub Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-handle"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 fill-sky-400" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>LinkedIn Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Avatar Image URL</span>
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Stats / DNA View */
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="text-xl font-bold text-indigo-400">{stats.readinessScore}%</div>
                  <div className="text-[10px] text-slate-400 uppercase">Readiness</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="text-xl font-bold text-white">Level {stats.level}</div>
                  <div className="text-[10px] text-slate-400 uppercase">{stats.levelTitle}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="text-xl font-bold text-amber-400">{stats.streakDays} Days</div>
                  <div className="text-[10px] text-slate-400 uppercase">Active Streak</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="text-xl font-bold text-cyan-400">{stats.xp.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Total XP</div>
                </div>
              </div>

              {/* 6-Axis Competencies */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Verified Competency Radar Scores
                </div>
                {Object.entries(stats.competencies).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 capitalize">{key.replace("_", " ")}</span>
                      <span className="font-bold text-white">{val}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-password store • PostgreSQL / SQLite Sync</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
