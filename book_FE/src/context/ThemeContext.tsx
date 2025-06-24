import { createContext, ReactNode, useEffect, useState } from "react";
import { getThemeType, ThemeName } from "../style/theme";
import { ThemeProvider as StyledProvider } from "styled-components";
import { GlobalStyle } from "../style/global";

const DEFAULT_THEME_NAME = "light";
const THEME_LOCALSTORAGE_KEY = "book_store_theme";

interface ThemeContextProps {
  themeName: ThemeName;
  setThemeName: React.Dispatch<React.SetStateAction<ThemeName>>;
}

export const ThemeContext = createContext<ThemeContextProps | null>(null);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    let theme = localStorage.getItem(THEME_LOCALSTORAGE_KEY);
    return theme === "light" || theme === "dark" ? theme : DEFAULT_THEME_NAME;
  });

  useEffect(() => {
    localStorage.setItem(THEME_LOCALSTORAGE_KEY, themeName);
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      <StyledProvider theme={getThemeType(themeName)}>
        <GlobalStyle themeName={themeName} />
        {children}
      </StyledProvider>
    </ThemeContext.Provider>
  );
}
