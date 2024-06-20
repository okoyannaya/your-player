import {
  BaseSyntheticEvent,
  ChangeEvent,
  FC,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import cn from "classnames";
import {Howl, Howler} from "howler";
import {
  deleteSongInPlaylist,
  getPlaylist,
  savePlaylist,
} from "../../indexeddb/indexeddb";
import {PlayerProps, Track} from "./player.types";
import {TrackItem} from "../track/track";
import {ControlBar} from "../control-bar/control-bar";
import {ProgressBar} from "../progress-bar/progress-bar";
import {ToggleThemeButton} from "../toggle-theme/toggle-theme";
import PlaylistBtn from "../icon/playlist.svg";
import Add from "../icon/add.svg";
import "./player.style.css";

const currentIndex = Number(localStorage.getItem("index")) || 0;

export const Player: FC<PlayerProps> = ({theme, toggleTheme}) => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [filesSong, setFilesSong] = useState<File[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(currentIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoop, setIsLoop] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isVolumeOff, setIsVolumeOff] = useState(false);
  const [isOpenPlaylist, setIsOpenPlaylist] = useState(false);
  const player = useRef<Howl | null>(null);
  const dragItemRef = useRef<number | null>(null);
  const dragOverRef = useRef<number | null>(null);
  const nameOfTheSong = playlist[currentTrackIndex]?.title.split(" - ");
  const fillButton = theme === "dark" ? "#fff" : "#000";
  const btnPlaylistSlyle = isOpenPlaylist
    ? {transform: "rotateY(-180deg)"}
    : {};

  const getingPlaylist = () => {
    getPlaylist().then((res) => {
      setFilesSong(res);
      setPlaylist(res?.map(createPlaylistItem) ?? []);
    });
  };

  const createNewTrack = (track: Track) => {
    player.current = new Howl({
      src: [track.file],
      html5: true,
      volume: volume,
      loop: isLoop,
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

  const handleOpenPlaylist = () => {
    setIsOpenPlaylist(!isOpenPlaylist);
  };

  useEffect(() => {
    if (playlist.length < 0) {
      setIsPlaying(false);
    }
  }, [currentTrackIndex, playlist.length]);

  useEffect(() => {}, [isOpenPlaylist]);

  useLayoutEffect(() => {
    getingPlaylist();
  }, []);

  return (
    <div className="audio-player">
      <div className="header_panel">
        <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
        <div
          className={cn(
            "upload",
            theme === "dark" ? "control-dark" : "control-light"
          )}
          title="Добавьте новые песни"
        >
          <input
            id="file-upload"
            type="file"
            multiple
            accept="audio/*"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload">
            <Add
              className="icon"
              width="50px"
              height="50px"
              fill={fillButton}
            />
          </label>
        </div>
        <div className="playlist_btn" style={btnPlaylistSlyle}>
          <PlaylistBtn
            className="icon"
            width="50px"
            height="50px"
            fill={fillButton}
            onClick={handleOpenPlaylist}
          />
        </div>
      </div>
      {isOpenPlaylist && (
        <div className={cn("playlist", theme === "dark" && "playlist-dark")}>
          {playlist.length > 0 ? (
            playlist?.map((track, index) => (
              <TrackItem
                handleDragStart={() => (dragItemRef.current = index)}
                onDragEnter={() => (dragOverRef.current = index)}
                hendleDragEnd={onDrop}
                hendleDragOver={onDragOver}
                currentTrackIndex={currentTrackIndex}
                handleDeleteTrack={() => {
                  handleDeleteTrack(index);
                }}
                index={index}
                skipTo={() => skipTo(index)}
                title={track.title}
                key={index}
                fill={fillButton}
              />
            ))
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{width: "155px", height: "50px", padding: "20px"}}>
                Добавьте песни с помощью иконки:
              </div>
              <label htmlFor="file-upload">
                <Add
                  className="icon"
                  width="50px"
                  height="50px"
                  fill={fillButton}
                />
              </label>
            </div>
          )}
        </div>
      )}

      <div className="controls">
        <ProgressBar
          play={() => skipTo(currentTrackIndex)}
          isLoop={isLoop}
          player={player.current}
          next={() => skip("next")}
          isPlaying={isPlaying}
        />
        <div className="name-of-the-song">
          {playlist?.length > 0 && nameOfTheSong?.length > 0 && (
            <>
              <div className="artist" title={nameOfTheSong[0]}>
                {nameOfTheSong[0]}
              </div>
              <div className="title" title={nameOfTheSong[1]}>
                {nameOfTheSong[1]}
              </div>
            </>
          )}
        </div>
        <ControlBar
          handleShuffle={handleShuffle}
          isShuffle={isShuffle}
          handleLoop={handleLoopTrack}
          isLoop={isLoop}
          handleVolumeOff={handleVolumeOff}
          handleVolumeUp={handleVolumeUp}
          theme={theme}
          isPlaying={isPlaying}
          next={() => skip("next")}
          pause={pause}
          play={() => play(currentTrackIndex)}
          prev={() => skip("prev")}
          handleVolumeChange={handleVolumeChange}
          volume={volume}
        />
      </div>
    </div>
  );
};
