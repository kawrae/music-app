import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import { nanoid } from "nanoid";
import usePersistedState from "../hooks/usePersistedState";
import { saveMedia, updateMedia, getMediaById, deleteMedia } from "../db";
import { cropImageDataUrlToSquare, cropImageFileToSquare, readFileAsDataUrl } from "../lib/image";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";
import IdeasPanel from "../components/IdeasPanel";
import StoragePanel from "../components/StoragePanel";
import TrackModal from "../components/TrackModal";

// empty track form on page load
const emptyTrackForm = {
  title: "",
  notes: "",
  type: "Song",
  coverArt: "",
  audioUrl: "",
};

function DashboardPage() {

  // main app state for saved tracks, search, editing, viewing and mobile sidebar
  const [tracks, setTracks] = usePersistedState("music-library-tracks", []);
  const [searchTerm, setSearchTerm] = useState("");
  const [toasts, setToasts] = useState([]);
  const [editingTrackId, setEditingTrackId] = useState(null);
  const [trackForm, setTrackForm] = useState(emptyTrackForm);
  const [viewingTrack, setViewingTrack] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // refs allow file inputs to be cleared manually after upload/cancel
  const coverInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // clears both file input elements
  function clearFileInputs() {
    if (coverInputRef.current) coverInputRef.current.value = "";
    if (audioInputRef.current) audioInputRef.current.value = "";
  }

  // resets form to default state and exits editing mode
  function resetForm() {
    setTrackForm(emptyTrackForm);
    setEditingTrackId(null);
    clearFileInputs();
  }

  // resuable helper for updating one field inside the track form
  function updateTrackForm(field, value) {
    setTrackForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // attaches recorded audio from the recording feature into the current form
  function handleRecordingReady(audioUrl) {
    updateTrackForm("audioUrl", audioUrl);
    notifyUser("Audio ready", "Voice recording is attached.");
  }

  // crop cover image to square before storing
  async function handleCoverReady(coverUrl) {
    const squareCover = await cropImageDataUrlToSquare(coverUrl);
    updateTrackForm("coverArt", squareCover);
    notifyUser("Cover ready", "Cover photo is attached.");
  }

  // clears temporary media from the form without deleting saved tracks
  function handleClearTracks() {
    updateTrackForm("audioUrl", "");
    updateTrackForm("coverArt", "");
    clearFileInputs();
    vibrate();
    showToast("Temporary media cleared.");
  }

  // temporary toast notification inside the UI
  function showToast(message) {
    const id = nanoid();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2600);
  }

  // sends a browser notification if supported, else falls back to toast
  async function notifyUser(title, body = "") {
    const message = body ? `${title}: ${body}` : title;

    if (!("Notification" in window)) {
      showToast(message);
      return;
    }

    if (Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.error("Notification request failed", error);
        showToast(message);
        return;
      }
    }

    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else {
      showToast(message);
    }
  }

  // triggers device vibration on supported devices
  const vibrate = (pattern = 200) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // handles uploaded cover art from file input and crops to square before attaching to form
  async function handleCoverArtUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await cropImageFileToSquare(file);
      updateTrackForm("coverArt", result);
      notifyUser("Cover attached.");
    } catch (error) {
      console.error("Failed to read cover image:", error);
    }

    event.target.value = "";
  }

  // handles uploaded audio file and converts to data URL before attaching to form
  async function handleAudioUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await readFileAsDataUrl(file);
      updateTrackForm("audioUrl", result);
      notifyUser("Audio attached", "The selected audio file is ready to add to your track.");
    } catch (error) {
      console.error("Failed to read audio file:", error);
    }
  }

  // creates a new track object, stores metadata in state and media in indexedDB
  async function createTrack() {
    const trimmedTitle = trackForm.title.trim();
    const trimmedNotes = trackForm.notes.trim();

    if (!trimmedTitle) return;

    const trackId = `track-${nanoid()}`;
    const timestamp = new Date().toISOString();

    const newTrack = {
      id: trackId,
      title: trimmedTitle,
      notes: trimmedNotes,
      type: trackForm.type,
      favourite: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setTracks((prev) => [newTrack, ...prev]);

    try {
      await saveMedia(trackId, {
        audioSrc: trackForm.audioUrl,
        coverImg: trackForm.coverArt,
      });
      notifyUser("Track uploaded", `"${trimmedTitle}" has been saved to your library.`);
      vibrate();
    } catch (error) {
      console.error("Failed to save track media:", error);
    }

    resetForm();
  }

  // saves changes to an existing track and updates its media in indexedDB if needed
  async function saveTrackEdit(trackId) {
    const trimmedTitle = trackForm.title.trim();
    const trimmedNotes = trackForm.notes.trim();

    if (!trimmedTitle || !trackId) return;

    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
              ...track,
              title: trimmedTitle,
              notes: trimmedNotes,
              type: trackForm.type,
              updatedAt: new Date().toISOString(),
            }
          : track
      )
    );

    try {
      await updateMedia(trackId, {
        audioSrc: trackForm.audioUrl,
        coverImg: trackForm.coverArt,
      });
      notifyUser("Track updated", `"${trimmedTitle}" has been updated in your library.`);
      vibrate();
    } catch (error) {
      console.error("Failed to update track media:", error);
    }

    resetForm();
  }

  // loads an existing track and its media into the form for editing
  async function startEditing(track) {
    setEditingTrackId(track.id);

    try {
      const media = await getMediaById(track.id);

      setTrackForm({
        title: track.title || "",
        notes: track.notes || "",
        type: track.type || "Song",
        coverArt: media?.coverImg || "",
        audioUrl: media?.audioSrc || "",
      });
    } catch (error) {
      console.error("Failed to load media for editing:", error);

      setTrackForm({
        title: track.title || "",
        notes: track.notes || "",
        type: track.type || "Song",
        coverArt: "",
        audioUrl: "",
      });
    }
  }

  // exits editing mode and clears the form
  function cancelEditing() {
    resetForm();
  }

  // asks for notification permission when the dashboard first loads
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          showToast("Enable notifications for progress states and media updates.");
        }
      });
    }
  }, []);

  // opens the selected track inside the modal viewer
  function viewTrack(track) {
    setViewingTrack(track);
  }

  // closes the track viewer modal
  function closeTrackView() {
    setViewingTrack(null);
  }

  // deletes a track after confirmation and removes its stored media too
  async function deleteTrack(trackId) {
    const trackToDelete = tracks.find((track) => track.id === trackId);
    const trackTitle = trackToDelete?.title?.trim() || "this track";
    const confirmed = window.confirm(`Delete "${trackTitle}"?`);

    if (!confirmed) {
      return;
    }

    setTracks((prev) => prev.filter((track) => track.id !== trackId));

    try {
      await deleteMedia(trackId);
    } catch (error) {
      console.error("Failed to delete track media:", error);
    }

    if (editingTrackId === trackId) {
      resetForm();
    }

    if (viewingTrack?.id === trackId) {
      closeTrackView();
    }
  }

  // updates track details directly from the modal component
  async function updateTrackFromModal(trackId, updates) {
    const now = new Date().toISOString();

    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
              ...track,
              title: updates.title,
              type: updates.type,
              notes: updates.notes,
              updatedAt: now,
            }
          : track
      )
    );

    setViewingTrack((prev) =>
      prev && prev.id === trackId
        ? {
            ...prev,
            title: updates.title,
            type: updates.type,
            notes: updates.notes,
            updatedAt: now,
          }
        : prev
    );

    await updateMedia(trackId, {
      audioSrc: updates.audioUrl,
      coverImg: updates.coverArt,
    });

    notifyUser("Track updated", `"${updates.title}" was updated.`);
    vibrate();
  }

  // toggle favourite status for a selected track
  function toggleFavourite(trackId) {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? { ...track, favourite: !track.favourite }
          : track
      )
    );
  }

  // filter tracks based on search input (title, notes or type)
  const filteredTracks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return tracks;

    return tracks.filter((track) => {
      const title = track.title?.toLowerCase() || "";
      const notes = track.notes?.toLowerCase() || "";
      const type = track.type?.toLowerCase() || "";

      return (
        title.includes(query) ||
        notes.includes(query) ||
        type.includes(query)
      );
    });
  }, [tracks, searchTerm]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex min-h-screen w-full">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-white/10 bg-zinc-950/60 px-4 py-3 backdrop-blur-sm lg:hidden">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-indigo-400/35 hover:bg-indigo-500/10 hover:text-indigo-100"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-indigo-400/35 hover:bg-indigo-500/10 hover:text-indigo-100"
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
          </div>

          {/* toats messages shown near the top of the screen */}
          {toasts.map((toast) => (
            <div key={toast.id} className="mx-4 mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 shadow-lg shadow-emerald-950/20 lg:mx-6">
              {toast.message}
            </div>
          ))}

          {/* top control area for search, uploads, create, edit and device features */}
          <HeaderBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            trackForm={trackForm}
            setTrackForm={setTrackForm}
            onCreateTrack={createTrack}
            onSaveEdit={() => saveTrackEdit(editingTrackId)}
            isEditing={Boolean(editingTrackId)}
            coverInputRef={coverInputRef}
            audioInputRef={audioInputRef}
            onCoverArtUpload={handleCoverArtUpload}
            onAudioUpload={handleAudioUpload}
            onCancelEditing={cancelEditing}
            onRecordingReady={handleRecordingReady}
            onCoverReady={handleCoverReady}
            onNotify={notifyUser}
            onClearTracks={handleClearTracks}
          />

          {/* main dashboard layout */}
          <section className="grid gap-8 px-4 py-6 lg:px-6 lg:py-8 xl:grid-cols-[1.7fr_1fr]">
            <IdeasPanel
              tracks={tracks}
              filteredTracks={filteredTracks}
              editingTrackId={editingTrackId}
              trackForm={trackForm}
              setTrackForm={setTrackForm}
              onStartEditing={startEditing}
              onCancelEditing={cancelEditing}
              onSaveEdit={saveTrackEdit}
              onDeleteTrack={deleteTrack}
              onToggleFavourite={toggleFavourite}
              onCreateTrack={createTrack}
              coverInputRef={coverInputRef}
              audioInputRef={audioInputRef}
              onCoverArtUpload={handleCoverArtUpload}
              onAudioUpload={handleAudioUpload}
              onViewTrack={viewTrack}
            />

            <div className="space-y-8 rounded-3xl border border-white/10 bg-zinc-900/40 p-4 shadow-lg shadow-black/20">
              <StoragePanel tracks={tracks} />
            </div>
          </section>
        </main>
      </div>

      {/* modal used to view and update an individual track */}
      <TrackModal
        track={viewingTrack}
        onClose={closeTrackView}
        onToggleFavourite={toggleFavourite}
        onDeleteTrack={deleteTrack}
        onUpdateTrack={updateTrackFromModal}
      />
    </div>
  );
}

export default DashboardPage;