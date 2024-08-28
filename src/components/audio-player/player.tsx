import {FC} from "react";
import cn from "classnames";
import {PlayerProps} from "./player.types";
import {TrackItem} from "../track/track";
import {ControlBar} from "../control-bar/control-bar";
import {ProgressBar} from "../progress-bar/progress-bar";
import {ToggleThemeButton} from "../toggle-theme/toggle-theme";
import {usePlayerControls} from "../../hooks/usePlayerControls";
import {usePlaylistManager} from "../../hooks/usePlaylistManager";
import PlaylistBtn from "../icon/playlist.svg";
import Add from "../icon/add.svg";
import "./player.style.css";

export const Player: FC<PlayerProps> = ({theme, toggleTheme}) => {
  const {
    btnPlaylistSlyle,
    handleOpenPlaylist,
    isOpenPlaylist,
    playlist,
    filesSong,
    setFilesSong,
    setPlaylist,
    createPlaylistItem,
  } = usePlaylistManager();

  const {
    handleVolumeChange,
    handleVolumeOff,
    handleVolumeUp,
    volume,
    isLoop,
    isShuffle,
    handleLoopTrack,
    handleShuffle,
    currentTrackIndex,
    handleFileUpload,
    play,
    dragItemRef,
    dragOverRef,
    handleDeleteTrack,
    isPlaying,
    onDragOver,
    onDrop,
    pause,
    player,
    skip,
    skipTo,
  } = usePlayerControls({
    createPlaylistItem,
    filesSong,
    playlist,
    setFilesSong,
    setPlaylist,
  });

  const nameOfTheSong = playlist[currentTrackIndex]?.title.split(" - ");
  const fillButton = theme === "dark" ? "#fff" : "#000";

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
