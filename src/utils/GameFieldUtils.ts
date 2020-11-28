import { Block } from "../model/GameFieldModel";

export const getLowestCell = ({ cells }: Block) => {
  return cells!.reduce((acc, cell) => (cell.row < acc.row ? cell : acc));
};

export const getHighestCell = ({ cells }: Block) => {
  return cells!.reduce((acc, cell) => (cell.row > acc.row ? cell : acc));
};

export const isOutOfBounds = ({ cells }: Block, cols: number) => {
  return cells!.some(({ row, col }) => row < 0 || col < 0 || col >= cols);
};

export const isAboveGameField = ({ cells }: Block, rows: number) => {
  return cells!.some(({ row, col }) => row >= rows);
};

export const isWithinGameField = ({ cells }: Block, rows: number) => {
  return cells!.some(({ row, col }) => row < rows);
};
