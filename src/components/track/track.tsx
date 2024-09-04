import {FC, useContext} from "react";
import {TrackItemProps} from "./track.types";
import { ThemeContext } from "../../ThemeProvider";
import Delete from "./../icon/delete.svg";
import "./track.style.css";



export const TrackItem: FC<TrackItemProps> = ({
  index,
  currentTrackIndex,
  skipTo,
  title,
  handleDeleteTrack,
  handleDragStart,
  hendleDragEnd,
  hendleDragOver,
  onDragEnter,
}) => {
  console.log('render');
  const {isDarkTheme} = useContext(ThemeContext);
const fillButton = isDarkTheme ? "#fff" : "#000";
  
  return (
    <div
      onDragStart={handleDragStart}
      onDragEnd={hendleDragEnd}
      onDragOver={hendleDragOver}
      onDragEnter={onDragEnter}
      draggable={true}
      className={`track ${
        index === currentTrackIndex ? "active" : ""
      } hover-track`}
    >
      <span onClick={skipTo}>
        {index + 1}. {title}
      </span>
      <Delete
        width="20px"
        height="20px"
        onClick={handleDeleteTrack}
        fill={fillButton}
        className="icon"
      />
    </div>
  );
};
