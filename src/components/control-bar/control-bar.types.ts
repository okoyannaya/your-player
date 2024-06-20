export interface ControlBarProps {
    isPlaying: boolean;
    play: VoidFunction;
    pause: VoidFunction;
    next: VoidFunction;
    prev: VoidFunction;
    theme?: string;
    volume: number;
    handleVolumeChange: (e: any) => void;
    handleVolumeUp: VoidFunction;
    handleVolumeOff: VoidFunction;
    isLoop: boolean;
    handleLoop: VoidFunction;
    handleShuffle: VoidFunction;
    isShuffle: boolean;
  }