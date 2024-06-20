import {openDB} from "idb";

const DB_NAME = "audio-player";
const STORE_NAME = "playlist";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

export const getPlaylist = async () => {
  const db = await dbPromise;
  return db.get(STORE_NAME, "playlist") || [];
};

export const savePlaylist = async (files: any) => {
  const db = await dbPromise;

  await db.put(STORE_NAME, files, "playlist");
};

export const deleteSongInPlaylist = async (updatePlaylist: any) => {
  const db = await dbPromise;

  await db.put(STORE_NAME, updatePlaylist, "playlist");
};
