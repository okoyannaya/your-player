import {
  useState,
  useRef,
  BaseSyntheticEvent,
  ChangeEvent,
  useEffect,
} from "react";
import {Howl, Howler} from "howler";
import {Track} from "../components/audio-player/player.types";
import {deleteSongInPlaylist, savePlaylist} from "../indexeddb/indexeddb";
import {SetState} from "../components/types";

const currentIndex = Number(localStorage.getItem("index")) || 0;

interface PlayerControlsProps {
  playlist: Track[];
  filesSong: File[];
  setFilesSong: SetState<File[]>;
  setPlaylist: SetState<Track[]>;
  createPlaylistItem: (arg: File) => Track;
}

export const usePlayerControls = ({
  playlist,
  filesSong,
  setFilesSong,
  setPlaylist,
  createPlaylistItem,
}: PlayerControlsProps) => {
  const [volume, setVolume] = useState(1);
  const [isVolumeOff, setIsVolumeOff] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(currentIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useRef<Howl | null>(null);
  const dragItemRef = useRef<number | null>(null);
  const dragOverRef = useRef<number | null>(null);

  const createNewTrack = (track: Track) => {
    player.current = new Howl({
      src: [track.file],
      html5: true,
      volume: volume,
      loop: isLoop,
    });
  };

  const handleVolumeChange = (e: BaseSyntheticEvent) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    Howler.volume(val);
  };

  const handleVolumeOff = () => {
    if (isVolumeOff) {
      setVolume(1);
      Howler.volume(1);
      setIsVolumeOff(false);
    } else {
      setVolume(0);
      Howler.volume(0);
      setIsVolumeOff(true);
    }
  };

  const handleVolumeUp = () => {
    setVolume(1);
    Howler.volume(1);
  };

  const handleLoopTrack = () => {
    setIsLoop(!isLoop);
  };
  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const loadTrack = (idx?: number) => {
    const index = idx ?? currentTrackIndex;
    if (index > playlist.length - 1) return setCurrentTrackIndex(0);
    if (index < 0) return setCurrentTrackIndex(playlist.length - 1);

    const track = playlist[index];
    createNewTrack(track);
    setCurrentTrackIndex(index);
  };

  const play = (index?: number) => {
    let newIndex = index !== undefined ? index : currentTrackIndex;
    setIsPlaying(true);
    localStorage.setItem("index", `${index}`);

    if (
      (currentTrackIndex === 0 || currentTrackIndex === index) &&
      !player.current
    ) {
      loadTrack(newIndex);
    } else if (index !== undefined && index !== currentTrackIndex) {
      player.current?.stop();
      player.current?.unload();
      loadTrack(newIndex);
    }
    player.current?.play();
  };

  const pause = () => {
    player.current?.pause();
    setIsPlaying(false);
  };

  const skipTo = (index: number) => {
    if (player.current) {
      player.current.stop();
    }
    play(index);
  };

  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const skip = (direction: "next" | "prev") => {
    let newIndex;

    if (isShuffle) {
      newIndex = getRandomInt(0, playlist.length - 1);
      if (newIndex === currentTrackIndex) {
        newIndex = currentTrackIndex + 1;
      }
      setCurrentTrackIndex(newIndex);
    } else {
      newIndex =
        direction === "next" ? currentTrackIndex + 1 : currentTrackIndex - 1;
    }

    if (newIndex >= playlist.length) newIndex = 0;
    if (newIndex < 0) newIndex = playlist.length - 1;
    skipTo(newIndex);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newTracks = files.map(createPlaylistItem) ?? [];
      const newPlaylist = [...playlist, ...newTracks];
      setPlaylist(newPlaylist);
      setFilesSong((p) => {
        const result = p?.length ? [...p, ...files] : [...files];
        savePlaylist(result);

        return result;
      });
    }
  };

  const handleDeleteTrack = async (index: number) => {
    const updatedPlaylist = playlist.filter((_, i) => i !== index);
    const newIndex = index < updatedPlaylist.length ? index : 0;
    setPlaylist(updatedPlaylist);

    if (updatedPlaylist.length === 0) {
      player.current?.stop();
      setIsPlaying(false);
      setCurrentTrackIndex(0);
    } else {
      if (index === currentTrackIndex) {
        console.log("тот трек", index === currentTrackIndex);
        player.current?.stop();
        setIsPlaying(false);
        setCurrentTrackIndex(newIndex);
        const track = updatedPlaylist[newIndex];
        createNewTrack(track);
      } else if (index < currentTrackIndex) {
        console.log("нетот трек", index !== currentTrackIndex);
        setCurrentTrackIndex(currentTrackIndex - 1);
      }
    }

    setFilesSong(() => {
      const result = filesSong.filter((_, i) => i !== index);
      deleteSongInPlaylist(result);

      return result;
    });
  };

  useEffect(() => {
    if (playlist.length < 0) {
      setIsPlaying(false);
    }
  }, [currentTrackIndex, playlist.length]);

  const onDragOver = (event: BaseSyntheticEvent) => {
    event.preventDefault();
  };

  const onDrop = () => {
    const newPlaylist = [...playlist];
    const dragItemIndex = dragItemRef.current as number;
    const dragOverIndex = dragOverRef.current as number;

    const dragFile = filesSong.splice(dragItemIndex, 1)[0];
    filesSong.splice(dragOverIndex, 0, dragFile);

    const dragItem = newPlaylist.splice(dragItemIndex, 1)[0];
    newPlaylist.splice(dragOverIndex, 0, dragItem);

    if (currentTrackIndex === dragItemIndex) {
      setCurrentTrackIndex(dragOverIndex);
    } else if (dragOverIndex === currentTrackIndex) {
      if (dragItemIndex > currentTrackIndex) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else if (dragItemIndex < currentTrackIndex) {
        setCurrentTrackIndex(currentTrackIndex - 1);
      }
    }
    dragItemRef.current = null;
    dragOverRef.current = null;

    savePlaylist(filesSong);
    setPlaylist(newPlaylist);
  };

  return {
    volume,
    isLoop,
    isShuffle,
    isPlaying,
    currentTrackIndex,
    player,
    dragItemRef,
    dragOverRef,
    handleVolumeUp,
    handleVolumeOff,
    handleVolumeChange,
    handleLoopTrack,
    handleShuffle,
    handleFileUpload,
    onDrop,
    onDragOver,
    handleDeleteTrack,
    skipTo,
    pause,
    play,
    skip,
  };
};
