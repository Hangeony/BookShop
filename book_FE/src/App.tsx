import Layout from "./components/layout/Layout";
import Detail from "./pages/Detail";
import Home from "./pages/Home";
import { ThemeContextProvider } from "./context/ThemeContext";
import ThemeSwitcher from "./components/header/ThemeSwitcher";

function App() {
  return (
    <ThemeContextProvider>
      <ThemeSwitcher />
      <Layout>
        <Home />
        <Detail />
      </Layout>
    </ThemeContextProvider>
  );
}

export default App;
