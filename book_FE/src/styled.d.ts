import "styled-components";
import type { Theme } from "./style/theme";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
