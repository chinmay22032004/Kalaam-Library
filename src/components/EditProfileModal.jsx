import { useState, useRef, useEffect, useCallback } from "react";
import { X, Camera, Loader, Save, User, Crop } from "lucide-react";
import Cropper from "react-easy-crop";

// Utility function to get cropped image
const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      // Output size
      canvas.width = 250;
      canvas.height = 250;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        250,
        250
      );

      // As Base64 string
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    image.onerror = (error) => reject(error);
  });
};

export default function EditProfileModal({ api, token, currentUser, open, close, onSuccess, showToast }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Cropping State
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (open && currentUser) {
      // eslint-disable-next-line
      setName(currentUser.displayName || "");
      setMobile(currentUser.mobile || "");
      setProfilePicture(currentUser.profilePicture || "");
      setImageSrc(null);
    }
  }, [open, currentUser]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return showToast("Please select a valid image file", "error");
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async () => {
    try {
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      setProfilePicture(croppedImageBase64);
      setImageSrc(null); // Close crop view
    } catch {
      showToast("Failed to crop image", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await api.updateProfile({ 
        displayName: name, 
        mobile, 
        profilePicture 
      }, token);
      
      showToast("Profile updated successfully!");
      onSuccess(user);
      close();
    } catch (err) {
      showToast(err?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-[fadeIn_0.2s_ease-out]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !imageSrc && close()}></div>
      <div className="relative bg-[#4E1A27] text-[#FFD59F] w-full max-w-md rounded-2xl shadow-2xl border border-[#FFD59F]/20 overflow-hidden transform transition-all scale-100 opacity-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-[#FFD59F]/10 flex items-center justify-between bg-[#6a2536]/20 shrink-0">
          <h2 className="font-bold text-lg flex items-center gap-2">
            {imageSrc ? <Crop className="w-5 h-5" /> : <User className="w-5 h-5" />} 
            {imageSrc ? "Crop Profile Picture" : "Edit Profile"}
          </h2>
          <button 
            onClick={() => {
              if (imageSrc) setImageSrc(null);
              else close();
            }} 
            className="p-1 hover:bg-[#FFD59F]/10 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto custom-scrollbar">
          {imageSrc ? (
            <div className="p-4 flex flex-col items-center">
              <div className="relative w-full h-64 sm:h-80 bg-black/50 rounded-lg overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              
              <div className="w-full mt-4 flex items-center gap-3">
                <span className="text-xs font-bold text-[#FFD59F]/60">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full accent-[#FFD59F]"
                />
              </div>

              <div className="w-full flex gap-3 mt-6">
                <button
                  onClick={() => setImageSrc(null)}
                  className="flex-1 py-3 rounded-lg font-bold border border-[#FFD59F]/30 hover:bg-[#FFD59F]/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="flex-1 bg-[#FFD59F] text-[#4E1A27] py-3 rounded-lg font-bold hover:bg-[#e6b87e] transition flex justify-center items-center gap-2"
                >
                  <Crop className="w-4 h-4" /> Save Crop
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-28 h-28 rounded-full border-4 border-[#FFD59F]/20 overflow-hidden cursor-pointer group bg-[#3b131b] flex items-center justify-center transition-all hover:border-[#FFD59F]"
                >
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-[#FFD59F]/30" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-xs text-[#FFD59F]/60 mt-2">Click to change picture</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#3b131b] border border-[#FFD59F]/20 focus:border-[#FFD59F] focus:ring-1 focus:ring-[#FFD59F] outline-none transition"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-1 block">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#3b131b] border border-[#FFD59F]/20 focus:border-[#FFD59F] focus:ring-1 focus:ring-[#FFD59F] outline-none transition"
                  placeholder="e.g. 9123456789"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFD59F] text-[#4E1A27] py-3 rounded-lg font-bold hover:bg-[#e6b87e] transition flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Profile</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
