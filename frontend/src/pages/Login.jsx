// SkillMap AI - Professional Authentication View (Login)
import React, { useState } from "react";
import {
  Bot,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  UserCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { sendPasswordReset } from "../services/firebase";

export default function Login({ onSwitchToRegister }) {
  const { login, loginWithGoogle, demoLogin, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    if (!email || !password) {
      setLocalError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setLocalError(err.message || "Failed to sign in. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    clearError();
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setLocalError(err.message || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setLocalError("Please enter your email above to receive a password reset link.");
      return;
    }
    setLocalError(null);
    try {
      const res = await sendPasswordReset(email);
      setResetMessage(res.message || `Password reset link dispatched to ${email}`);
    } catch (err) {
      setLocalError(err.message || "Could not trigger reset email.");
    }
  };

  const handleDemo = async (preset) => {
    setLocalError(null);
    clearError();
    setLoading(true);
    try {
      await demoLogin(preset);
    } catch (err) {
      setLocalError(err.message || "Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-8 z-10 relative">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 rounded-2xl mb-3 shadow-inner">
            <Bot className="w-9 h-9 text-indigo-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            SKILLMAP <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">AI 2.0</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            AI Career Intelligence & Skill Acceleration Platform
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sign In with Firebase Authentication</span>
          </div>
        </div>

        {/* Feedback Alerts */}
        {activeError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1 leading-relaxed">{activeError}</div>
          </div>
        )}

        {resetMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
            <div className="flex-1 leading-relaxed">{resetMessage}</div>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
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
                placeholder="name@university.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>LOGIN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative px-3 bg-slate-900 text-xs uppercase tracking-widest text-slate-500 font-medium">
            OR
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-medium text-sm rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Create Account Link */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 cursor-pointer"
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Demo Quick-Login Section */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Demo Quick Logins
            </span>
            <span className="text-[10px] text-slate-500">Instant Access</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleDemo("rajat")}
              className="px-3 py-2 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/50 hover:border-indigo-600 text-left text-xs flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                  RV
                </span>
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-white">
                    Rajat Verma
                  </div>
                  <div className="text-[10px] text-slate-400">Full Stack Aspirant (Level 4)</div>
                </div>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Student
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo("rahul")}
              className="px-3 py-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/50 hover:border-cyan-600 text-left text-xs flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-600/30 text-cyan-300 font-bold flex items-center justify-center text-[10px]">
                  RS
                </span>
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-white">
                    Rahul Sharma
                  </div>
                  <div className="text-[10px] text-slate-400">AI/ML Engineer (Level 2)</div>
                </div>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Fresh Grad
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemo("recruiter")}
              className="px-3 py-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 hover:border-emerald-600 text-left text-xs flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center text-[10px]">
                  SJ
                </span>
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-white">
                    Sarah Jenkins
                  </div>
                  <div className="text-[10px] text-slate-400">Technical Recruiter (HireTech)</div>
                </div>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Recruiter
              </span>
            </button>
          </div>
        </div>

        {/* Security / Privacy Badge */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero passwords persisted in DB • Firebase Identity Secured</span>
        </div>
      </div>
    </div>
  );
}
