export interface HeaderPanelProps {
   
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
   
    btnPlaylistSlyle: {
      transform: string;
  } | {
      transform?: undefined;
  };
    handleOpenPlaylist: VoidFunction ;
  }