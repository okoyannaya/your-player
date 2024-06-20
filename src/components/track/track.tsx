import {FC} from "react";
import Delete from "./../icon/delete.svg";
import {TrackItemProps} from "./track.types";
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
  fill,
}) => {
  return (
    <div
      onDragStart={handleDragStart}
      onDragEnd={hendleDragEnd}
      onDragOver={hendleDragOver}
      onDragEnter={onDragEnter}
      draggable={true}
      key={index}
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
        fill={fill}
        className="icon"
      />
    </div>
  );
};
