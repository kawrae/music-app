import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

export const db = new Dexie("music-app-media");

db.version(1).stores({
  media: "id, updatedAt",
});

export async function saveMedia(id, mediaData = {}) {
  if (!id) {
    throw new Error("saveMedia requires a valid track id.");
  }

  const payload = {
    id,
    audioSrc: mediaData.audioSrc || "",
    coverImg: mediaData.coverImg || "",
    updatedAt: new Date().toISOString(),
  };

  try {
    await db.media.put(payload);
    return payload;
  } catch (error) {
    console.error(`Failed to save media for ${id}:`, error);
    throw error;
  }
}

export async function updateMedia(id, mediaData = {}) {
  if (!id) {
    throw new Error("updateMedia requires a valid track id.");
  }

  try {
    const existing = await db.media.get(id);

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

export async function getMediaById(id) {
  if (!id) return null;

  try {
    return (await db.media.get(id)) || null;
  } catch (error) {
    console.error(`Failed to get media for ${id}:`, error);
    return null;
  }
}

export function useMediaById(id) {
  return useLiveQuery(async () => {
    if (!id) return null;
    return (await db.media.get(id)) || null;
  }, [id]);
}

export async function deleteMedia(id) {
  if (!id) return;

  try {
    await db.media.delete(id);
  } catch (error) {
    console.error(`Failed to delete media for ${id}:`, error);
    throw error;
  }
}