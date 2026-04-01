import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import usePersistedState from "../hooks/usePersistedState";
import Sidebar from "../components/Sidebar";
import LibraryGrid from "../components/LibraryGrid";
import TrackModal from "../components/TrackModal";
import { deleteMedia, updateMedia } from "../db";

function LibraryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tracks, setTracks] = usePersistedState("music-library-tracks", []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrack, setSelectedTrack] = useState(null);

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

  function closeModal() {
    setSelectedTrack(null);
  }

  function toggleFavourite(trackId) {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? { ...track, favourite: !track.favourite }
          : track
      )
    );

    setSelectedTrack((prev) =>
      prev && prev.id === trackId
        ? { ...prev, favourite: !prev.favourite }
        : prev
    );
  }

  async function deleteTrack(trackId) {
    const trackToDelete = tracks.find((track) => track.id === trackId);
    const trackTitle = trackToDelete?.title?.trim() || "this track";
    const confirmed = window.confirm(`Delete "${trackTitle}"?`);

    if (!confirmed) {
      return;
    }

    setTracks((prev) => prev.filter((track) => track.id !== trackId));
    setSelectedTrack((prev) => (prev?.id === trackId ? null : prev));

    try {
      await deleteMedia(trackId);
    } catch (error) {
      console.error("Failed to delete track media:", error);
    }
  }

  async function updateTrack(trackId, updates) {
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

    setSelectedTrack((prev) =>
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
  }

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

        <main className="flex-1">
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

          <header className="border-b border-white/10 px-6 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-zinc-400">Library</p>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Your collection
                </h2>
              </div>

              <div className="w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search library..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-400/35"
                />
              </div>
            </div>
          </header>

          <section className="px-6 py-8">
            <LibraryGrid
              tracks={filteredTracks}
              onSelectTrack={setSelectedTrack}
            />
          </section>
        </main>
      </div>

      <TrackModal
        track={selectedTrack}
        onClose={closeModal}
        onToggleFavourite={toggleFavourite}
        onDeleteTrack={deleteTrack}
        onUpdateTrack={updateTrack}
      />
    </div>
  );
}

export default LibraryPage;