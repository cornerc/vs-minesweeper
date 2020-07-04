export type BaseToggles = "drawer" | "configDialog" | "infoDialog";
export type SingleToggles = "scoreAlert" | "snackbar";
export type TurnToggles = "waitingDialog";

export interface SideMenuItems {
  icon: string;
  title: string;
  text: string;
  to: object;
}

export interface HeaderCenterItems {
  icon: string;
  title: string;
  content: string;
}

export interface HeaderRightItems {
  icon: string;
  title: string;
}

export interface Config {
  darkTheme: boolean;
  mine: number;
  row: number;
  col: number;
}
