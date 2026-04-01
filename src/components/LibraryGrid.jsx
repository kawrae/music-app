import { useMediaById } from "../db";

function LibraryItem({ track, onSelectTrack }) {
  const media = useMediaById(track.id);

  return (
    <button
      type="button"
      onClick={() => onSelectTrack(track)}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left transition hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-indigo-500/5"
    >
      <div className="aspect-square bg-zinc-900">
        {media?.coverImg ? (
          <img
            src={media.coverImg}
            alt={track.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No cover art
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              {track.type}
            </p>
            <h3 className="mt-1 text-lg font-medium text-white">
              {track.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Added: {new Date(track.createdAt).toLocaleDateString()}
            </p>
          </div>

          <span
            className={
              "rounded-2xl border px-3 py-2 text-xs " +
              (track.favourite
                ? "border-indigo-400/35 bg-indigo-500/10 text-indigo-200"
                : "border-white/10 text-zinc-200")
            }
          >
            {track.favourite ? "★ Saved" : "Open"}
          </span>
        </div>

        <p className="mt-4 line-clamp-3 text-sm text-zinc-400">
          {track.notes || "No notes added."}
        </p>
      </div>
    </button>
  );
}

function LibraryGrid({ tracks, onSelectTrack }) {
  if (tracks.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-10 text-center">
        <h3 className="text-xl font-semibold">No tracks found</h3>
        <p className="mt-2 text-sm text-zinc-400">
          Try another search or add a new track from the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {tracks.map((track) => (
        <LibraryItem
          key={track.id}
          track={track}
          onSelectTrack={onSelectTrack}
        />
      ))}
    </div>
  );
}

export default LibraryGrid;