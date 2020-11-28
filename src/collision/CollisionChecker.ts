import { Block, Coordinates, Direction } from "../model/GameFieldModel";

export const checkCollision = (
  activeBlock: Block,
  blocks: Block[],
  { rows, cols }: { rows: number; cols: number }
): Direction[] => {
  const adjacentCells = activeBlock.cells!.reduce(
    (
      acc: Array<[Coordinates, Direction]>,
      cell
    ): Array<[Coordinates, Direction]> => {
      const left = [{ row: cell.row, col: cell.col - 1 }, Direction.LEFT] as [
        Coordinates,
        Direction
      ];
      const right = [{ row: cell.row, col: cell.col + 1 }, Direction.RIGHT] as [
        Coordinates,
        Direction
      ];
      const down = [{ row: cell.row - 1, col: cell.col }, Direction.DOWN] as [
        Coordinates,
        Direction
      ];

      return [...acc, left, right, down] as Array<[Coordinates, Direction]>;
    },
    [] as Array<[Coordinates, Direction]>
  );
  const blockCollisions = adjacentCells.filter(([cell]) => {
    return blocks.some(({ cells }) =>
      cells!.some(({ row, col }) => cell.row === row && cell.col === col)
    );
  });
  const gridCollisions = adjacentCells.filter(
    ([{ row, col }]) => row < 0 || col < 0 || col >= cols
  );
  return [...blockCollisions, ...gridCollisions]
    .map(([, direction]) => direction)
    .reduce(
      (acc, dir) => (acc.includes(dir) ? acc : [...acc, dir]),
      [] as Direction[]
    );
};

export const checkOverlap = (
  block: Block,
  blocks: Block[],
  { rows, cols }: { rows: number; cols: number }
): boolean => {
  const hasBoundsOverlap = block.cells!.some(
    ({ row, col }) => row < 0 || col < 0 || col >= cols
  );
  if (hasBoundsOverlap) {
    return true;
  }
  const hasBlockOverlap = blocks
    .reduce((acc, { cells }) => [...acc, ...cells!], [] as Coordinates[])
    .some(({ row, col }) =>
      block.cells!.some(
        ({ row: blockRow, col: blockCol }) =>
          row === blockRow && col === blockCol
      )
    );
  return hasBlockOverlap;
};
