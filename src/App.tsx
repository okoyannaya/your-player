import {Quota} from "./components/quota/quota";
import {Player} from "./components/audio-player/player";
import cn from "classnames";
import "./App.css";
import { ThemeProvider } from "./ThemeProvider";

function App() {


 
  return (
    <ThemeProvider>
        <div className={cn("app")}>
      <Quota />
      <Player />
    </div>
    </ThemeProvider>
  
  );
}

export default App;
