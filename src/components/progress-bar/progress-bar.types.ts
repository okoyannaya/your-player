export interface ProgressBarProps {
    player: Howl | null;
    next: VoidFunction;
    play: VoidFunction;
    isPlaying?: boolean;
    isLoop:boolean;
  }
  