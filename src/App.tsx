import {createContext, useState} from "react";
import {Quota} from "./components/quota/quota";
import {Player} from "./components/audio-player/player";
import cn from "classnames";
import "./App.css";

export const ThemeContext = createContext("");
const themeStorage = localStorage.getItem("theme") || "light";

function App() {
  const [theme, setTheme] = useState(themeStorage);

  return (
    <ThemeContext.Provider value={theme as string}>
      <div className={cn("app", theme)}>
        <Quota />
        <Player
          theme={theme as string}
          toggleTheme={() => {
            localStorage.setItem("theme", theme === "dark" ? "light" : "dark");
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
