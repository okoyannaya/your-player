import {FC} from "react";
import Dark from "./../icon/dark.svg";
import Light from "./../icon/light.svg";
import "./toggle-theme.style.css";

export interface ToggleThemeButtonProps {
  theme?: string;
  toggleTheme?: VoidFunction;
}
export const ToggleThemeButton: FC<ToggleThemeButtonProps> = ({
  theme,
  toggleTheme,
}) => {
  return (
    <div onClick={toggleTheme} className="themeButton" title="Поменяйте тему">
      {theme === "dark" ? (
        <Dark className="icon" width="50px" height="50px" fill="#fff" />
      ) : (
        <Light className="icon"  width="50px" height="50px" />
      )}
    </div>
  );
};
