import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function ThemeSwitcher() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "'ThemeContextProps | null' 형식에 'setThemeName' 속성이 없습니다."
    );
  }
  const { themeName, setThemeName } = context;

  function toggleTheme() {
    setThemeName(themeName === "light" ? "dark" : "light");
  }

  return (
    <button
      onClick={() => {
        toggleTheme();
      }}
    >
      {themeName}
    </button>
  );
}

export default ThemeSwitcher;
