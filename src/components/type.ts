export type BaseToggles = "drawer" | "configDialog" | "infoDialog";
export type SingleToggles = "scoreAlert" | "snackbar";

export interface SideMenuItems {
  icon: string;
  title: string;
  text: string;
  click: Function;
}

export interface HeaderRightItems {
  icon: string;
  title: string;
  click: Function;
}

export interface Config {
  darkTheme: boolean;
  mine: number;
  row: number;
  col: number;
}
