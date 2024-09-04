import {useContext} from "react";
import {ToggleThemeButton} from "../toggle-theme/toggle-theme";
import {HeaderPanelProps} from "./header-panel.types";
import {ThemeContext} from "../../ThemeProvider";
import PlaylistBtn from "../icon/playlist.svg";
import Add from "../icon/add.svg";

export const HeaderPanel = ({
  handleFileUpload,
  btnPlaylistSlyle,
  handleOpenPlaylist,
}: HeaderPanelProps) => {
  console.log("header");

  const {isDarkTheme} = useContext(ThemeContext);
  const fillButton = isDarkTheme ? "#fff" : "#000";

  const handleClearEventFiles: React.MouseEventHandler<HTMLInputElement> = (
    event
  ) => {
    const eventTarget = event.target as EventTarget & {value: any};
    eventTarget.value = null;
  };

  return (
    <div className="header_panel">
      <ToggleThemeButton />
      <div className="upload" title="Добавьте новые песни">
        <input
          id="file-upload"
          type="file"
          multiple
          accept="audio/*"
          onChange={handleFileUpload}
          onClick={handleClearEventFiles}
        />
        <label htmlFor="file-upload">
          <Add className="icon" width="50px" height="50px" fill={fillButton} />
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
  );
};
