export interface Track {
  order?: number;
  id?: number;
  title: string;
  file: string;
  howl?: Howl | null;
}




export interface PlayerProps {
  theme?: string;
  toggleTheme?: VoidFunction;
}