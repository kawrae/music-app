import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

function StoragePanel({ tracks }) {
  const mediaItems = useLiveQuery(() => db.media.toArray(), [], []);
  const totalTracks = tracks.length;
  const favouritesCount = tracks.filter((track) => track.favourite).length;
  const withAudioCount =
    mediaItems?.filter((media) => Boolean(media.audioSrc)).length || 0;
  const storageProgress =
    totalTracks === 0 ? "0%" : `${Math.min((totalTracks / 50) * 100, 100)}%`;

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-6">
      <h3 className="text-xl font-semibold">Storage</h3>

      <div className="mt-4 space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-sm text-zinc-400">
            <span>Tracks saved</span>
            <span>{totalTracks}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5">
            <div
              className="h-2 rounded-full bg-white transition-all"
              style={{ width: storageProgress }}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-zinc-400">Audio files</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {withAudioCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-zinc-400">Favourites</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {favouritesCount}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-zinc-500">
      </p>
    </div>
  );
}

export default StoragePanel;