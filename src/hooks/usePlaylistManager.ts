import {useEffect, useLayoutEffect, useState} from "react";
import {getPlaylist} from "../indexeddb/indexeddb";
import {Track} from "../components/audio-player/player.types";

export const usePlaylistManager = () => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [filesSong, setFilesSong] = useState<File[]>([]);
  const [isOpenPlaylist, setIsOpenPlaylist] = useState(false);

  const btnPlaylistSlyle = isOpenPlaylist
    ? {transform: "rotateY(-180deg)"}
    : {};

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

  useEffect(() => {}, [isOpenPlaylist]);

  return {
    playlist,
    filesSong,
    btnPlaylistSlyle,
    isOpenPlaylist,
    setPlaylist,
    setFilesSong,
    createPlaylistItem,
    handleOpenPlaylist,
  };
};
