export interface Track {
  title: string;
  file: string;
  howl?: Howl | null;
}

export interface PlayerProps {
  theme?: string;
  toggleTheme?: VoidFunction;
}
