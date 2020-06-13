export interface Field {
  mine: number;
  row: number;
  col: number;
  cells: Cell[];
}

export interface Cell {
  isOpen: boolean;
  isFlag: boolean;
  isLandMine: boolean;
  aroundMines: number;
}

export interface Config {
  darkTheme: boolean;
  mine: number;
  row: number;
  col: number;
}

export interface OpenMap {
  row: number;
  col: number;
  group: number;
}

export interface Session {
  [sessionId: string]: {
    user: {
      id: string;
      name: string;
      score: number;
    };
    opponent: {
      id: string;
      name: string;
      score: number;
    };
    field: {
      [fieldId: string]: {
        isLandMine: string;
        aroundMines: number;
        isOpen: boolean;
      };
    };
  };
}

export type CountType = "countUp" | "countDown";
