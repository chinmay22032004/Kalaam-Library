import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';

export default function LoginModal({ api, open, close, onLogin, showToast }) {
  const [tab, setTab] = useState("login");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminAllowed, setAdminAllowed] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const exists = await api.isAdminRegistered();
        setAdminAllowed(!exists);
      } catch {
        setAdminAllowed(true);
      }
    })();
  }, [open, api]);

  const reset = () => {
    setMobile("");
    setPassword("");
    setConfirm("");
    setDisplayName("");
    setIsAdmin(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!mobile || !password)
      return showToast("Enter mobile and password", "error");
    if (password.length < 6)
      return showToast("Password must be at least 6 characters", "error");
    if (password !== confirm)
      return showToast("Passwords do not match", "error");
    setLoading(true);
    try {
      await api.registerUser({
        mobile,
        password,
        displayName,
        isAdmin,
      });
      showToast("Registered successfully. You can now log in.");
      setTab("login");
      reset();
    } catch (err) {
      showToast(err?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!mobile || !password)
      return showToast("Enter mobile and password", "error");
    setLoading(true);
    try {
      const { token, user } = await api.loginUser({ mobile, password });
      onLogin({ token, user });
      reset();
      close();
      showToast("Logged in successfully.");
    } catch (err) {
      showToast(err?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { token, user } = await api.loginWithGoogle(credentialResponse.credential);
      onLogin({ token, user });
      reset();
      close();
      showToast("Logged in with Google successfully.");
    } catch (err) {
      showToast(err?.message || "Google Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50" onClick={close}></div>
      <div className="relative bg-[#4E1A27] text-[#FFD59F] w-full max-w-md rounded-2xl shadow-2xl border border-[#FFD59F]/20 overflow-hidden">
        <div className="p-4 border-b border-[#FFD59F]/10 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("login")}
              className={`px-3 py-1 rounded ${tab === "login" ? "bg-[#FFD59F] text-[#4E1A27]" : "text-[#FFD59F]/80"}`}
            >
              Login
            </button>
            <button
              onClick={() => setTab("register")}
              className={`px-3 py-1 rounded ${tab === "register" ? "bg-[#FFD59F] text-[#4E1A27]" : "text-[#FFD59F]/80"}`}
            >
              Register
            </button>
          </div>
          <button onClick={close} className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col items-center">
          <div className="w-full mb-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showToast("Google Login Failed", "error")}
              theme="filled_black"
              shape="pill"
            />
          </div>
          <div className="flex items-center w-full gap-2 mb-4">
            <div className="flex-1 h-px bg-[#FFD59F]/20"></div>
            <span className="text-[#FFD59F]/50 text-xs uppercase">or</span>
            <div className="flex-1 h-px bg-[#FFD59F]/20"></div>
          </div>
          <div className="w-full">
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <label className="text-xs" htmlFor="login-mobile">
                Mobile Number
              </label>
              <input
                id="login-mobile"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-2 rounded bg-[#3b131b] border border-[#FFD59F]/10"
                placeholder="eg. 9123456789"
                aria-label="Login mobile number"
              />
              <label className="text-xs" htmlFor="login-password">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-[#3b131b] border border-[#FFD59F]/10"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#FFD59F] text-[#4E1A27] py-2 rounded font-bold"
                >
                  {loading ? "..." : "Login"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab("register");
                  }}
                  className="flex-1 border border-[#FFD59F]/20 py-2 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <label className="text-xs">Display Name (optional)</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2 rounded bg-[#3b131b] border border-[#FFD59F]/10"
              />
              <label className="text-xs" htmlFor="register-mobile">
                Mobile Number
              </label>
              <input
                id="register-mobile"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-2 rounded bg-[#3b131b] border border-[#FFD59F]/10"
                placeholder="eg. 9123456789"
                aria-label="Register mobile number"
              />
              <label className="text-xs" htmlFor="register-password">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-[#3b131b] border border-[#FFD59F]/10"
              />
              <label className="text-xs">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full p-2 rounded bg-[#3b131b] border border-[#FFD59F]/10"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    disabled={!adminAllowed}
                  />
                  Register as admin
                </label>
                {!adminAllowed && (
                  <span className="text-[11px] text-gray-400">
                    Admin already registered
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#FFD59F] text-[#4E1A27] py-2 rounded font-bold"
                >
                  {loading ? "..." : "Register"}
                </button>
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="flex-1 border border-[#FFD59F]/20 py-2 rounded"
                >
                  Back
                </button>
              </div>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
