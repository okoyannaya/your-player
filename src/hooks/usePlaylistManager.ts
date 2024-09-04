import {ChangeEvent, useLayoutEffect, useMemo, useState} from "react";
import {getPlaylist, savePlaylist} from "../indexeddb/indexeddb";
import {Track} from "../components/audio-player/player.types";

export const usePlaylistManager = () => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [filesSong, setFilesSong] = useState<File[]>([]);
  const [isOpenPlaylist, setIsOpenPlaylist] = useState(false);

  const handleFileUpload = async(e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      console.log("files", files);

      const newTracks = files.map(createPlaylistItem) ?? [];
      const newPlaylist = [...playlist, ...newTracks];
      setPlaylist(newPlaylist);
      setFilesSong((p) => {
        console.log("p", p);

        const result = p?.length ? [...p, ...files] : [...files];
        savePlaylist(result);
        console.log("res", result);

        return result;
      });
    }
  };

  const btnPlaylistSlyle = useMemo(() =>
    isOpenPlaylist ? {transform: "rotateY(-180deg)"} : {}, [isOpenPlaylist]
  );

  const getingPlaylist = () => {
    getPlaylist().then((res) => {
      setFilesSong(res);
      setPlaylist(res?.map(createPlaylistItem) ?? []);
    });
  };

  const createPlaylistItem = (file: File) => {
    const url = URL.createObjectURL(file);
    return {
      title: file.name.split(".mp3").join(""),
      file: url,
      howl: null,
    };
  };

  const handleOpenPlaylist = () => {
    setIsOpenPlaylist(!isOpenPlaylist);
  };

  useLayoutEffect(() => {
    getingPlaylist();
  }, []);



  return {
    playlist,
    filesSong,
    btnPlaylistSlyle,
    isOpenPlaylist,
    setPlaylist,
    setFilesSong,
    createPlaylistItem,
    handleOpenPlaylist,
    handleFileUpload
  };
};
