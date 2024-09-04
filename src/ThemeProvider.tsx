import {createContext, ReactNode, useState} from "react";

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const theme: boolean = JSON.parse(localStorage.getItem("theme") ?? "");

const defaultValue: ThemeContextType = {
  isDarkTheme: theme,

  toggleTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultValue);

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  const [isDarkTheme, setIsDarkTheme] = useState(defaultValue.isDarkTheme);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  localStorage.setItem("theme", `${isDarkTheme}`);

  return (
    <ThemeContext.Provider value={{isDarkTheme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
