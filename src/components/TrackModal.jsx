import { useEffect, useMemo, useRef, useState } from "react";
import { X, Trash2, Pencil } from "lucide-react";
import { useMediaById } from "../db";
import { cropImageFileToSquare, readFileAsDataUrl } from "../lib/image";
import AudioPlayer from "./AudioPlayer";

function TrackModal({
  track,
  onClose,
  onToggleFavourite,
  onDeleteTrack,
  onUpdateTrack,
}) {
  const media = useMediaById(track?.id);
  const coverInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    type: "Song",
    notes: "",
    audioUrl: "",
    coverArt: "",
  });

  const resolvedMedia = useMemo(
    () => ({
      audioUrl: draft.audioUrl || media?.audioSrc || "",
      coverArt: draft.coverArt || media?.coverImg || "",
    }),
    [draft.audioUrl, draft.coverArt, media?.audioSrc, media?.coverImg],
  );

  useEffect(() => {
    if (!track) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [track, onClose]);

  useEffect(() => {
    if (!track) return;

    setDraft({
      title: track.title || "",
      type: track.type || "Song",
      notes: track.notes || "",
      audioUrl: media?.audioSrc || "",
      coverArt: media?.coverImg || "",
    });
    setIsEditing(false);
  }, [track, media?.audioSrc, media?.coverImg]);

  if (!track) return null;

  async function handleDelete() {
    await onDeleteTrack(track.id);
  }

  function updateDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCoverUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await cropImageFileToSquare(file);
      updateDraft("coverArt", dataUrl);
    } catch (error) {
      console.error("Failed to read cover image:", error);
    }

    event.target.value = "";
  }

  async function handleAudioUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const resolved = typeof dataUrl === "string" ? dataUrl : "";
      updateDraft("audioUrl", resolved);
    } catch (error) {
      console.error("Failed to read audio file:", error);
    }

    event.target.value = "";
  }

  async function handleSaveEdit() {
    const payload = {
      title: draft.title.trim() || "Untitled Track",
      type: draft.type,
      notes: draft.notes,
      audioUrl: resolvedMedia.audioUrl,
      coverArt: resolvedMedia.coverArt,
    };

    await onUpdateTrack(track.id, payload);
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setDraft({
      title: track.title || "",
      type: track.type || "Song",
      notes: track.notes || "",
      audioUrl: media?.audioSrc || "",
      coverArt: media?.coverImg || "",
    });
    setIsEditing(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative my-4 w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              {isEditing ? draft.type : track.type}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
              {isEditing ? draft.title || "Untitled Track" : track.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Added: {new Date(track.createdAt).toLocaleDateString()}
            </p>
          </div>

          {isEditing ? (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
              <input
                type="text"
                value={draft.title}
                onChange={(e) => updateDraft("title", e.target.value)}
                placeholder="Track title"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />

              <select
                value={draft.type}
                onChange={(e) => updateDraft("type", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option>Song</option>
                <option>Guitar Riff</option>
                <option>Demo</option>
                <option>Voice Memo</option>
                <option>Idea Sketch</option>
              </select>

              <textarea
                rows="3"
                value={draft.notes}
                onChange={(e) => updateDraft("notes", e.target.value)}
                placeholder="Track notes"
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                >
                  Change Audio
                </button>
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                >
                  Change Cover
                </button>
              </div>

              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleAudioUpload}
              />
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
            </div>
          ) : (
            track.notes && (
              <p className="text-sm text-zinc-400">{track.notes}</p>
            )
          )}

          {resolvedMedia.audioUrl && (
            <AudioPlayer src={resolvedMedia.audioUrl} />
          )}

          {resolvedMedia.coverArt && (
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-zinc-950">
              <img
                src={resolvedMedia.coverArt}
                alt={track.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onToggleFavourite(track.id)}
                  className={
                    "rounded-2xl border px-4 py-2 text-sm transition " +
                    (track.favourite
                      ? "border-indigo-400/35 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/15"
                      : "border-white/10 text-zinc-200 hover:border-indigo-400/30 hover:bg-indigo-500/10")
                  }
                >
                  {track.favourite ? "★ Saved" : "☆ Save"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:bg-white/5"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackModal;
