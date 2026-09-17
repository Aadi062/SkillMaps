// SkillMap AI - Professional Registration View (Create Account)
import React, { useState } from "react";
import {
  Bot,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Compass,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CAREER_GOALS = [
  "Full Stack Developer",
  "Software Engineer",
  "AI/ML Engineer",
  "Data Engineer",
  "Cybersecurity Analyst",
  "Cloud & DevOps Engineer"
];

export default function Register({ onSwitchToLogin }) {
  const { register, error, clearError } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [careerGoal, setCareerGoal] = useState("Full Stack Developer");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!name.trim()) {
      setLocalError("Please provide your full name.");
      return;
    }
    if (!email.trim()) {
      setLocalError("Please provide your email address.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match. Please verify.");
      return;
    }
    if (!agreedToTerms) {
      setLocalError("You must agree to the Privacy Policy & Terms to create an account.");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, careerGoal);
    } catch (err) {
      setLocalError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const activeError = localError || error;

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

      {/* Main Registration Card */}
      <div className="w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-8 z-10 relative">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 rounded-2xl mb-3 shadow-inner">
            <Bot className="w-9 h-9 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            CREATE YOUR SKILLMAP
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover Your Career • Prove Your Skills • Build Your Future
          </p>
        </div>

        {/* Feedback Alert */}
        {activeError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1 leading-relaxed">{activeError}</div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajat Verma"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajat@university.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Password & Confirm Password (Side-by-side or stacked) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Confirm Password
                </label>
                {passwordsMatch && (
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Match
                  </span>
                )}
                {passwordMismatch && (
                  <span className="text-[10px] text-rose-400 font-semibold">
                    Mismatch
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    passwordsMatch
                      ? "border-emerald-600/70 focus:ring-2 focus:ring-emerald-500/30"
                      : passwordMismatch
                      ? "border-rose-600/70 focus:ring-2 focus:ring-rose-500/30"
                      : "border-slate-700/80 focus:ring-2 focus:ring-indigo-500/50"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Career Goal Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Primary Career Goal
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Compass className="w-4 h-4" />
              </div>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
              >
                {CAREER_GOALS.map((goal) => (
                  <option key={goal} value={goal} className="bg-slate-900 text-white">
                    {goal}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Privacy Policy & Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-indigo-600 bg-slate-950 border-slate-700 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-slate-300 leading-snug">
                I agree to the{" "}
                <span className="text-indigo-400 font-semibold underline underline-offset-2">
                  SkillMap Privacy Policy
                </span>{" "}
                & Terms. (Zero passwords persisted on server; verified by Firebase Auth).
              </span>
            </label>
          </div>

          {/* Primary Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login Link */}
        <div className="mt-6 text-center text-xs text-slate-400 pt-4 border-t border-slate-800/80">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 cursor-pointer"
          >
            Log In
          </button>
        </div>

        {/* Security / Privacy Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>PostgreSQL & SQLite User Store • OWASP Defense Guard</span>
        </div>
      </div>
    </div>
  );
}
