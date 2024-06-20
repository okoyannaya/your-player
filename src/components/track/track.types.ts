export interface TrackItemProps {
    index: number;
    currentTrackIndex: number;
    skipTo: VoidFunction;
    title: string;
    handleDeleteTrack: VoidFunction;
    handleDragStart: VoidFunction;
    hendleDragEnd: VoidFunction;
    hendleDragOver: (event: any) => void;
    onDragEnter: VoidFunction;
    fill: string;
  }
  