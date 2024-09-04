import cn from "classnames";
import {TrackItem} from "../track/track";
import {ControlBar} from "../control-bar/control-bar";
import {ProgressBar} from "../progress-bar/progress-bar";
import {usePlayerControls} from "../../hooks/usePlayerControls";
import {useContext} from "react";
import {usePlaylistManager} from "../../hooks/usePlaylistManager";
import {HeaderPanel} from "../header-panel/header-panel";
import {ThemeContext} from "../../ThemeProvider";
import {useDraggale} from "../../hooks/useDraggable";
import Add from "../icon/add.svg";
import "./player.style.css";

export const Player = () => {
  const {isDarkTheme} = useContext(ThemeContext);
  const fillButton = isDarkTheme ? "#fff" : "#000";

  const {
    btnPlaylistSlyle,
    handleOpenPlaylist,
    isOpenPlaylist,
    playlist,
    filesSong,
    setFilesSong,
    setPlaylist,
    createPlaylistItem,
    handleFileUpload,
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

    play,
    handleDeleteTrack,
    isPlaying,
    pause,
    player,
    skip,
    skipTo,
    setCurrentTrackIndex,
  } = usePlayerControls({
    createPlaylistItem,
    filesSong,
    playlist,
    setFilesSong,
    setPlaylist,
  });

  const {onDragOver, onDrop, dragItemRef, dragOverRef} = useDraggale({
    currentTrackIndex,
    filesSong,
    playlist,
    setCurrentTrackIndex,
    setPlaylist,
  });

  const nameOfTheSong = playlist[currentTrackIndex]?.title.split(" - ");

  return (
    <div className="audio-player">
      <HeaderPanel
        btnPlaylistSlyle={btnPlaylistSlyle}
        handleFileUpload={handleFileUpload}
        handleOpenPlaylist={handleOpenPlaylist}
      />
      {isOpenPlaylist && (
        <div className={cn("playlist")}>
          {!!playlist.length ? (
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
