import { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaById } from "../db";
import CameraGalleryChooser from "./CameraGalleryChooser";
import AudioPlayer from "./AudioPlayer";

function IdeaCard({
  idea,
  isEditing,
  editingTrack,
  setEditingTrack,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  onDeleteIdea,
  onToggleFavourite,
  coverInputRef,
  audioInputRef,
  onCoverArtUpload,
  onAudioUpload,
  onViewTrack,
}) {
  const [showCameraGalleryChooser, setShowCameraGalleryChooser] =
    useState(false);
  const media = useMediaById(idea.id);

  const displayCoverArt = isEditing
    ? editingTrack.coverArt || media?.coverImg || ""
    : media?.coverImg || "";

  const displayAudioUrl = isEditing
    ? editingTrack.audioUrl || media?.audioSrc || ""
    : media?.audioSrc || "";

  function updateField(field, value) {
    setEditingTrack((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleCameraCapture(photoDataUrl) {
    updateField("coverArt", photoDataUrl);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="aspect-square bg-zinc-900">
        {displayCoverArt ? (
          <img
            src={displayCoverArt}
            alt={editingTrack.title || idea.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No cover art
          </div>
        )}
      </div>

      <div className="p-5">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editingTrack.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />

            <select
              value={editingTrack.type}
              onChange={(e) => updateField("type", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white focus:outline-none"
            >
              <option>Song</option>
              <option>Guitar Riff</option>
              <option>Demo</option>
              <option>Voice Memo</option>
              <option>Idea Sketch</option>
            </select>

            <textarea
              rows="4"
              value={editingTrack.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                className="flex-1 rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5"
              >
                Change Audio
              </button>
              <button
                type="button"
                onClick={() => setShowCameraGalleryChooser(true)}
                className="flex-1 rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5"
              >
                Change Cover
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onSaveEdit(idea.id)}
                className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
              >
                Save
              </button>
              <button
                onClick={onCancelEditing}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {idea.type}
                </p>
                <h4 className="mt-1 text-lg font-medium text-white">
                  {idea.title}
                </h4>
                <p className="mt-1 text-sm text-zinc-500">
                  Added: {new Date(idea.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => onToggleFavourite(idea.id)}
                className={
                  "rounded-2xl border px-3 py-2 text-xs transition " +
                  (idea.favourite
                    ? "border-indigo-400/35 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/15"
                    : "border-white/10 text-zinc-200 hover:border-indigo-400/30 hover:bg-indigo-500/10")
                }
              >
                {idea.favourite ? "★ Saved" : "☆ Save"}
              </button>
            </div>

            {idea.notes ? (
              <p className="mt-4 line-clamp-3 text-sm text-zinc-400">
                {idea.notes}
              </p>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">No notes added.</p>
            )}

            {displayAudioUrl && (
              <div className="mt-4">
                <AudioPlayer src={displayAudioUrl} />
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => onViewTrack(idea)}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5"
              >
                Open
              </button>
              <button
                onClick={() => onStartEditing(idea)}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteIdea(idea.id)}
                className="rounded-2xl border border-red-500/20 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {showCameraGalleryChooser && (
        <CameraGalleryChooser
          onClose={() => setShowCameraGalleryChooser(false)}
          onCameraCapture={handleCameraCapture}
        />
      )}
    </div>
  );
}

export default IdeaCard;
