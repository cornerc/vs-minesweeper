export type BaseToggles = "drawer" | "configDialog" | "infoDialog";

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
