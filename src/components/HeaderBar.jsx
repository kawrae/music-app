import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import CameraGalleryChooser from "./CameraGalleryChooser";

function HeaderBar({
  searchTerm,
  setSearchTerm,
  trackForm,
  setTrackForm,
  onCreateTrack,
  onSaveEdit,
  isEditing,
  coverInputRef,
  audioInputRef,
  onAudioUpload,
  onCancelEditing,
  onCoverReady,
  onClearTracks,
}) {
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);

  function updateField(field, value) {
    setTrackForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleCoverSelection(coverUrl) {
    setIsCoverPickerOpen(false);
    if (onCoverReady) {
      onCoverReady(coverUrl);
      return;
    }

    updateField("coverArt", coverUrl);
  }

  return (
    <header className="border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Dashboard</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Your workspace
            </h2>
            <p className="mt-1 text-sm text-zinc-500"></p>
          </div>

          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search tracks, notes, or types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-400/35"
            />
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl border border-white/10 bg-zinc-900/60 p-4 shadow-lg shadow-black/20 xl:grid-cols-[1.1fr_1fr_auto]">
          <input
            type="text"
            placeholder="Track title..."
            value={trackForm.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-400/35"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={trackForm.type}
              onChange={(e) => updateField("type", e.target.value)}
              className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-400/35"
            >
              <option>Song</option>
              <option>Guitar Riff</option>
              <option>Demo</option>
              <option>Voice Memo</option>
              <option>Idea Sketch</option>
            </select>

            <div className="relative flex gap-2">
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                className="flex-1 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-200 transition hover:border-indigo-400/35 hover:bg-indigo-500/10"
              >
                Audio
              </button>
              <button
                type="button"
                onClick={() => setIsCoverPickerOpen(true)}
                className="flex-1 rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-200 transition hover:border-indigo-400/35 hover:bg-indigo-500/10"
              >
                Cover
              </button>
            </div>
          </div>

          <div className="xl:col-span-3">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {trackForm.audioUrl && (
                <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                  Audio uploaded
                </span>
              )}
              {trackForm.coverArt && (
                <span className="rounded-full border border-indigo-400/35 bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">
                  Cover uploaded
                </span>
              )}
            </div>

            {(trackForm.coverArt || trackForm.audioUrl) && (
              <div className="mb-3 grid gap-3 md:grid-cols-2">
                {trackForm.coverArt && (
                  <div className="rounded-2xl border border-white/10 p-2">
                    <p className="mb-1 text-xs text-zinc-400">Cover preview</p>
                    <img
                      src={trackForm.coverArt}
                      alt="Cover preview"
                      className="h-28 w-full rounded-xl object-cover"
                    />
                  </div>
                )}

                {trackForm.audioUrl && (
                  <div className="rounded-2xl border border-white/10 p-2">
                    <p className="mb-2 text-xs text-zinc-400">Audio preview</p>
                    <AudioPlayer src={trackForm.audioUrl} />
                  </div>
                )}
              </div>
            )}

            <textarea
              rows="3"
              placeholder="Add notes about chords, lyrics, arrangement, tone, BPM, or reminders..."
              value={trackForm.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-400/35"
            />
          </div>

          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={onAudioUpload}
            className="hidden"
          />

          <div className="xl:col-span-3 flex flex-wrap gap-3 border-t border-white/10 pt-4">
            {isEditing ? (
              <>
                <button
                  onClick={onSaveEdit}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
                >
                  Save
                </button>
                <button
                  onClick={onCancelEditing}
                  className="rounded-2xl border border-white/10 bg-zinc-950/60 px-5 py-3 text-sm text-zinc-200 transition hover:bg-white/5"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onCreateTrack}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
                >
                  Add Track
                </button>
                {(trackForm.audioUrl || trackForm.coverArt) && (
                  <button
                    onClick={onClearTracks}
                    className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm text-red-300 transition hover:bg-red-500/20"
                  >
                    Clear Tracks
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {isCoverPickerOpen && (
        <CameraGalleryChooser
          onClose={() => setIsCoverPickerOpen(false)}
          onCameraCapture={handleCoverSelection}
          galleryInputRef={coverInputRef}
        />
      )}

    </header>
  );
}

export default HeaderBar;
