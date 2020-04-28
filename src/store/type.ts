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
  mine: number;
  row: number;
  col: number;
}
