// TODO: Replace this usage with block factory.
import {Block, BlockType, Coordinates, Direction,} from "../model/GameFieldModel";

export const getBlockColor = (type: BlockType): string => {
  switch (type) {
    case BlockType.I:
      return "cyan";
    case BlockType.L:
      return "orange";
    case BlockType.J:
      return "blue";
    case BlockType.T:
      return "pink";
    case BlockType.O:
      return "yellow";
    case BlockType.S:
      return "green";
    case BlockType.Z:
      return "red";
  }
  return "green";
};

export const blockFactory = (
  type: BlockType,
  anchor: Coordinates,
  orientation?: Direction
): Block => {
  orientation = orientation || Direction.UP;
  return {
    type,
    anchor,
    orientation,
    color: getBlockColor(type),
    cells: getCellsForBlock({ type, orientation, anchor }),
  };
};

export const getCellsForBlock = ({
  type,
  anchor,
  orientation,
}: {
  type: BlockType;
  anchor: Coordinates;
  orientation: Direction;
}) => {
  switch (type) {
    case BlockType.I:
      if (orientation === Direction.UP || orientation === Direction.DOWN) {
        return [
          { col: anchor.col - 1, row: anchor.row },
          anchor,
          { col: anchor.col + 1, row: anchor.row },
          { col: anchor.col + 2, row: anchor.row },
        ];
      } else if (orientation === Direction.RIGHT || orientation === Direction.LEFT) {
        return [
          { col: anchor.col, row: anchor.row + 1 },
          anchor,
          { col: anchor.col, row: anchor.row - 1 },
          { col: anchor.col, row: anchor.row - 2 },
        ];
      }
      break;
    case BlockType.T:
      if (orientation === Direction.UP) {
        return [
          { col: anchor.col - 1, row: anchor.row },
          anchor,
          { col: anchor.col + 1, row: anchor.row },
          { col: anchor.col, row: anchor.row + 1 },
        ];
      } else if (orientation === Direction.RIGHT) {
        return [
          { col: anchor.col, row: anchor.row - 1 },
          anchor,
          { col: anchor.col, row: anchor.row + 1 },
          { col: anchor.col + 1, row: anchor.row },
        ];
      } else if (orientation === Direction.DOWN) {
        return [
          { col: anchor.col - 1, row: anchor.row },
          anchor,
          { col: anchor.col + 1, row: anchor.row },
          { col: anchor.col, row: anchor.row - 1 },
        ];
      } else if (orientation === Direction.LEFT) {
        return [
          { col: anchor.col, row: anchor.row - 1 },
          anchor,
          { col: anchor.col, row: anchor.row + 1 },
          { col: anchor.col - 1, row: anchor.row },
        ];
      }
      break;
    case BlockType.L:
      if (orientation === Direction.UP) {
        return [
          anchor,
          { col: anchor.col + 1, row: anchor.row },
          { col: anchor.col, row: anchor.row + 1 },
          { col: anchor.col, row: anchor.row + 2 },
        ];
      } else if (orientation === Direction.RIGHT) {
        return [
          anchor,
          { col: anchor.col, row: anchor.row - 1 },
          { col: anchor.col + 1, row: anchor.row },
          { col: anchor.col + 2, row: anchor.row },
        ];
      } else if (orientation === Direction.DOWN) {
        return [
          anchor,
          { col: anchor.col - 1, row: anchor.row },
          { col: anchor.col, row: anchor.row - 1 },
          { col: anchor.col, row: anchor.row - 2 },
        ];
      } else if (orientation === Direction.LEFT) {
        return [
          anchor,
          { col: anchor.col - 1, row: anchor.row },
          { col: anchor.col - 2, row: anchor.row },
          { col: anchor.col, row: anchor.row + 1 },
        ];
      }
      break;
    case BlockType.J:
      if (orientation === Direction.UP) {
        return [
          anchor,
          { col: anchor.col - 1, row: anchor.row },
          { col: anchor.col, row: anchor.row + 1 },
          { col: anchor.col, row: anchor.row + 2 },
        ];
      } else if (orientation === Direction.RIGHT) {
        return [
          anchor,
          { col: anchor.col, row: anchor.row + 1 },
          { col: anchor.col + 1, row: anchor.row },
          { col: anchor.col + 2, row: anchor.row },
        ];
      } else if (orientation === Direction.DOWN) {
        return [
          anchor,
          { col: anchor.col + 1, row: anchor.row },
          { col: anchor.col, row: anchor.row - 1 },
          { col: anchor.col, row: anchor.row - 2 },
        ];
      } else if (orientation === Direction.LEFT) {
        return [
          anchor,
          { col: anchor.col - 1, row: anchor.row },
          { col: anchor.col - 2, row: anchor.row },
          { col: anchor.col, row: anchor.row - 1 },
        ];
      }
      break;
    case BlockType.O:
      return [
        anchor,
        { col: anchor.col + 1, row: anchor.row },
        { col: anchor.col, row: anchor.row - 1 },
        { col: anchor.col + 1, row: anchor.row - 1 },
      ];
    case BlockType.S:
      if (orientation === Direction.UP || orientation === Direction.DOWN) {
        return [
          anchor,
          { col: anchor.col - 1, row: anchor.row },
          { col: anchor.col, row: anchor.row + 1 },
          { col: anchor.col + 1, row: anchor.row + 1 },
        ];
      } else if (
        orientation === Direction.RIGHT ||
        orientation === Direction.LEFT
      ) {
        return [
          anchor,
          { col: anchor.col, row: anchor.row + 1 },
          { col: anchor.col + 1, row: anchor.row },
          { col: anchor.col + 1, row: anchor.row - 1 },
        ];
      }
      break;
    case BlockType.Z:
      if (orientation === Direction.UP || orientation === Direction.DOWN) {
        return [
          anchor,
          { col: anchor.col + 1, row: anchor.row },
          { col: anchor.col, row: anchor.row + 1 },
          { col: anchor.col - 1, row: anchor.row + 1 },
        ];
      } else if (
        orientation === Direction.RIGHT ||
        orientation === Direction.LEFT
      ) {
        return [
          anchor,
          { col: anchor.col, row: anchor.row - 1 },
          { col: anchor.col + 1, row: anchor.row },
          { col: anchor.col + 1, row: anchor.row + 1 },
        ];
      }
      break;
  }
};
