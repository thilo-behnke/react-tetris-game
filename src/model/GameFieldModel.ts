export type Block = {
  anchor: Coordinates; // [col, row]
  type: BlockType;
  color: string;
  orientation: Direction;
  cells?: Array<Cell>;
};

export type Cell = Coordinates & {
  isMarkedForDestruction?: boolean;
}

export enum BlockType {
  I,
  J,
  L,
  O,
  S,
  T,
  Z,
}

export enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

export type Coordinates = {
  row: number;
  col: number;
};

export enum GameLevelState {
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
  LOST = "LOST",
  WON = "WON",
}
