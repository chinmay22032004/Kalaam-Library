import { useState } from "react";
import { X } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';

export default function LoginModal({ api, open, close, onLogin, showToast }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { token, user } = await api.loginWithGoogle(credentialResponse.credential);
      onLogin({ token, user });
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
      <div className="relative bg-[#4E1A27] text-[#FFD59F] w-full max-w-sm rounded-2xl shadow-2xl border border-[#FFD59F]/20 overflow-hidden">
        <div className="p-4 border-b border-[#FFD59F]/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#FFD59F]">Login to Kalaam</h2>
          <button onClick={close} className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-6">
          <p className="text-sm text-center text-[#FFD59F]/80">
            Welcome to Kalaam Library! Please sign in using your Google account to access your favorites and issue books.
          </p>
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showToast("Google Login Failed", "error")}
              theme="filled_black"
              shape="pill"
            />
          </div>
          {loading && <p className="text-xs text-[#FFD59F]/50 animate-pulse">Authenticating...</p>}
        </div>
      </div>
    </div>
  );
}
