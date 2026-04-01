import { useRef } from "react";
import { X } from "lucide-react";
import { cropImageFileToSquare } from "../lib/image";

function CameraGalleryChooser({ onClose, onCameraCapture, galleryInputRef }) {
  const deviceInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await cropImageFileToSquare(file);
      onCameraCapture(dataUrl);
    } catch (error) {
      console.error("Failed to read selected image:", error);
    } finally {
      event.target.value = "";
      onClose();
    }
  };

  const openCameraAttachment = () => {
    const input = deviceInputRef.current;
    if (!input) return;

    input.setAttribute("accept", "image/*");
    input.setAttribute("capture", "environment");
    input.click();
  };

  const openGalleryAttachment = () => {
    const input = deviceInputRef.current;
    if (!input) return;

    input.setAttribute("accept", "image/*");
    input.removeAttribute("capture");
    input.click();
  };

  return (
    <>
      <input
        ref={deviceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <h2 className="mb-6 text-xl font-semibold text-white">Choose Cover Source</h2>

          <div className="flex flex-col gap-3">
            <button
              onClick={openCameraAttachment}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10"
            >
              Use Device Camera
            </button>
            <button
              onClick={openGalleryAttachment}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white hover:bg-white/10"
            >
              Choose from Gallery
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CameraGalleryChooser;

