export type ThemeName = "light" | "dark";
type ColorKey = "text" | "primary" | "background" | "secondary" | "third";

export interface Theme {
  name: ThemeName;
  color: Record<ColorKey, string>;
}

export const light: Theme = {
  name: "light",
  color: {
    text: "#222",
    primary: "bronw",
    background: "lightgray",
    secondary: "blue",
    third: "green",
  },
};

export const dark: Theme = {
  name: "dark",
  color: {
    text: "#efefef",
    primary: "coral",
    background: "midnightblue",
    secondary: "blue",
    third: "green",
  },
};

export const getThemeType = (themeName: ThemeName) => {
  switch (themeName) {
    case "light":
      return light;
    case "dark":
      return dark;
  }
};
