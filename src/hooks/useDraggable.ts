import { BaseSyntheticEvent, useRef } from "react";
import { savePlaylist } from "../indexeddb/indexeddb";
import { Track } from "../components/audio-player/player.types";
import { SetState } from "../components/types";

interface useDraggaleArgs {
    playlist: Track[];
    filesSong: File[];
    setPlaylist: SetState<Track[]>;
    currentTrackIndex: number;
    setCurrentTrackIndex: SetState<number>;
  }
  

export const useDraggale = ({filesSong, setPlaylist, playlist, currentTrackIndex, setCurrentTrackIndex }: useDraggaleArgs) =>{
    const dragItemRef = useRef<number | null>(null);
    const dragOverRef = useRef<number | null>(null);
    
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
        dragItemRef,
        dragOverRef,
        onDrop,
        onDragOver,
        
      }
}