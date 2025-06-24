import { createGlobalStyle } from "styled-components";
import "sanitize.css";
import { ThemeName } from "./theme";

interface Props {
  themeName: ThemeName;
}

export const GlobalStyle = createGlobalStyle<Props>`
  body {
    padding: 0;
    margin: 0;
  }

  h1{
    margin: 0;
    padding: 0;
  }

  * {
    background-color: ${(props) => props.theme.color.background};
    color: ${(props) => props.theme.color.text}
  }
`;
