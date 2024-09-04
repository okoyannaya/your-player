import {useContext} from "react";
import {ThemeContext} from "../../ThemeProvider";
import Light from "./../icon/light.svg";
import Dark from "./../icon/dark.svg";
import "./toggle-theme.style.css";

export const ToggleThemeButton = () => {

  const {isDarkTheme, toggleTheme} = useContext(ThemeContext)
  return (
    <div onClick={toggleTheme} className="themeButton" title="Поменяйте тему">
      {isDarkTheme ? (
        <Dark className="icon" width="50px" height="50px" fill="#fff" />
      ) : (
        <Light className="icon" width="50px" height="50px" />
      )}
    </div>
  );
};
