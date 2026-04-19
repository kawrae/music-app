import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

// initialise indexedDB database using Dexie
export const db = new Dexie("music-app-media");

// define schema: media table keyed by id with indexed updatedAt
db.version(1).stores({
  media: "id, updatedAt",
});

// saves new media (audio + cover) for a track
export async function saveMedia(id, mediaData = {}) {
  if (!id) {
    throw new Error("saveMedia requires a valid track id.");
  }

  // create payload with defaults
  const payload = {
    id,
    audioSrc: mediaData.audioSrc || "",
    coverImg: mediaData.coverImg || "",
    updatedAt: new Date().toISOString(),
  };

  try {
    // put = insert or overwrite
    await db.media.put(payload);
    return payload;
  } catch (error) {
    console.error(`Failed to save media for ${id}:`, error);
    throw error;
  }
}

// updates existing media while preserving previous values if not provided
export async function updateMedia(id, mediaData = {}) {
  if (!id) {
    throw new Error("updateMedia requires a valid track id.");
  }

  try {
    // fetch existing record first
    const existing = await db.media.get(id);

    // merge new values with existing ones
    const payload = {
      id,
      audioSrc: mediaData.audioSrc ?? existing?.audioSrc ?? "",
      coverImg: mediaData.coverImg ?? existing?.coverImg ?? "",
      updatedAt: new Date().toISOString(),
    };

    await db.media.put(payload);
    return payload;
  } catch (error) {
    console.error(`Failed to update media for ${id}:`, error);
    throw error;
  }
}

// retrieves media for a specific track by id
export async function getMediaById(id) {
  if (!id) return null;

  try {
    return (await db.media.get(id)) || null;
  } catch (error) {
    console.error(`Failed to get media for ${id}:`, error);
    return null;
  }
}

// React hook that provides live updating media data from indexedDB
export function useMediaById(id) {
  return useLiveQuery(async () => {
    if (!id) return null;
    return (await db.media.get(id)) || null;
  }, [id]);
}

// deletes media associated with a track
export async function deleteMedia(id) {
  if (!id) return;

  try {
    await db.media.delete(id);
  } catch (error) {
    console.error(`Failed to delete media for ${id}:`, error);
    throw error;
  }
}