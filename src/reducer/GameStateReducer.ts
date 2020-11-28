import {getHighestCell, isAboveGameField, isOutOfBounds} from "../utils/GameFieldUtils";
import {Block, BlockType, Coordinates, Direction, GameLevelState,} from "../model/GameFieldModel";
import {blockFactory, getCellsForBlock} from "../factory/BlockFactory";
import {checkCollision, checkOverlap} from "../collision/CollisionChecker";

export type GameState = {
  gameField: { rows: number; cols: number };
  nextBlock: BlockType;
  activeBlock: Block | null;
  activeBlockProjectedCells: Coordinates[] | null;
  holdActiveLocked: boolean;
  blocks: Block[];
  activeBlockHasFloorContact: boolean;
  gameLevelState: GameLevelState;
  score: number;
};

export type GameStateAction =
  | { type: "add_block"; payload: BlockType }
  | { type: "move_active_block"; payload: Direction }
  | { type: "crash_active_block" }
  | { type: "turn_active_block" }
  | { type: "update_field" }
  | { type: "hold_active_block" }
  | { type: "toggle_pause"; payload: boolean }
  | { type: "restart"; payload: BlockType };

export const GameStateReducer = (state: GameState, action: GameStateAction): GameState => {
  switch (action.type) {
    case "add_block":
        return spawnBlock(state, action.payload);
    case "move_active_block":
      if (
        !state.activeBlock ||
        action.payload === Direction.UP
      ) {
        return state;
      }
      if (isOutOfBounds(state.activeBlock, state.gameField.cols)) {
        return state;
      }
      const currentBlockCollisions = checkCollision(
        state.activeBlock,
        state.blocks,
        state.gameField
      );
      const updatedState = handleFloorContact(
        state.activeBlock,
        currentBlockCollisions,
        state
      );
      if (updatedState) {
        return updatedState;
      }
      if (
        (currentBlockCollisions.includes(Direction.LEFT) &&
          action.payload === Direction.LEFT) ||
        (currentBlockCollisions.includes(Direction.RIGHT) &&
          action.payload === Direction.RIGHT)
      ) {
        return state;
      }
      const updatedAnchor =
        action.payload === Direction.DOWN
          ? {
              ...state.activeBlock.anchor,
              row: state.activeBlock.anchor.row - 1,
            }
          : action.payload === Direction.LEFT
          ? {
              ...state.activeBlock.anchor,
              col: state.activeBlock.anchor.col - 1,
            }
          : {
              ...state.activeBlock.anchor,
              col: state.activeBlock.anchor.col + 1,
            };
      const updatedBlock = action.payload === Direction.DOWN && currentBlockCollisions.includes(Direction.DOWN) ? state.activeBlock : {
        ...state.activeBlock,
        anchor: updatedAnchor,
        cells: getCellsForBlock({
          anchor: updatedAnchor,
          orientation: state.activeBlock.orientation,
          type: state.activeBlock.type,
        }),
      };
      const updatedBlockCollisions = checkCollision(updatedBlock, state.blocks, state.gameField);

      return {
        ...state,
        activeBlock: updatedBlock,
        activeBlockProjectedCells: getProjectedPosition(updatedBlock, state).cells!,
        activeBlockHasFloorContact: updatedBlockCollisions.includes(Direction.DOWN)
      };
    case "turn_active_block":
      if (!state.activeBlock || state.activeBlockHasFloorContact) {
        return state;
      }
      const newOrientation = (state.activeBlock!.orientation + 1) % 4;
      const updatedActiveBlock = tryToTurnBlock(state, newOrientation);
      return {
        ...state,
        activeBlock: updatedActiveBlock,
        activeBlockProjectedCells: getProjectedPosition(updatedActiveBlock, state).cells!
      };
    case "crash_active_block":
      if (!state.activeBlock) {
        return state;
      }
      let newBlock = getProjectedPosition(state.activeBlock, state);
      const collisions = checkCollision(newBlock, state.blocks, state.gameField);
      const newState = handleFloorContact(
        newBlock,
        collisions,
        state
      );
      if (newState) {
        return newState;
      }
      return {
        ...state,
        activeBlock: newBlock,
        activeBlockHasFloorContact: collisions.includes(Direction.DOWN)
      };
    case "update_field":
      const updatedBlocks = [...state.blocks, state.activeBlock!];
      const cellsToDestroy = updatedBlocks
          .reduce((acc: Coordinates[], { cells }) => [...acc, ...cells!], [])
          .reduce((acc: any[], cell) => {
            const existingRecord =
                acc.find(({ row }) => row === cell.row)?.cols || [];
            return [
              ...acc.filter(({ row }) => row !== cell.row),
              { row: cell.row, cols: [...existingRecord, cell.col] },
            ];
          }, [])
          .filter(({ cols }) => cols.length === state.gameField.cols)
          .reduce(
              (acc, { row, cols }) => [
                ...acc,
                ...cols.map((c: number) => ({ row, col: c })),
              ],
              []
          ) as Coordinates[];
      const blocksWithoutDestroyedCells = updatedBlocks
        .map(({ cells, ...rest }) => {
          const updatedCells = cells!.filter(
            (cell: Coordinates) =>
              !cellsToDestroy.some(
                ({ row, col }: { row: number; col: number }) =>
                  cell.row === row && cell.col === col
              )
          );
          return {
            cells: updatedCells,
            ...rest,
          };
        })
        .filter(({ cells }) => cells.length);
      const rowsDestroyed = cellsToDestroy.reduce(
        (acc: number[], { row }) => (acc.includes(row) ? acc : [...acc, row]),
        []
      );
      const blocksWithUpdatedPositions = blocksWithoutDestroyedCells.map(
        ({ cells, ...rest }) => ({
          ...rest,
          cells: cells.map(({ row, col }) => {
            const rowsDestroyedBelow = rowsDestroyed.filter(
              (rowDestroyed) => rowDestroyed < row
            );
            return {
              row: row - rowsDestroyedBelow.length,
              col,
            };
          }),
        })
      );
      const score =
        state.score + rowsDestroyed.length * cellsToDestroy.length * 10;
      return {
        ...state,
        activeBlock: null,
        activeBlockProjectedCells: null,
        blocks: blocksWithUpdatedPositions,
        activeBlockHasFloorContact: false,
        holdActiveLocked: false,
        score,
      };
    case "hold_active_block":
      if(!state.activeBlock || state.holdActiveLocked) {
        return state;
      }
      return {...spawnBlock(state, state.activeBlock!.type), holdActiveLocked: true};
    case "toggle_pause":
      if(state.gameLevelState !== GameLevelState.RUNNING && state.gameLevelState !== GameLevelState.PAUSED) {
        return state;
      }
      return {
        ...state,
        gameLevelState: action.payload ? GameLevelState.PAUSED : GameLevelState.RUNNING
      }
    case "restart":
      return createInitialState(
        state.gameField.rows,
        state.gameField.cols,
        action.payload
      );
    default:
      return state;
  }
};

export const createInitialState = (
  rows: number,
  cols: number,
  nextBlock: BlockType
): GameState => {
  return {
    nextBlock,
    blocks: [],
    activeBlock: null,
    activeBlockProjectedCells: null,
    holdActiveLocked: false,
    gameField: { rows, cols },
    activeBlockHasFloorContact: false,
    gameLevelState: GameLevelState.RUNNING,
    score: 0,
  };
};

export const handleFloorContact = (
  block: Block,
  collisions: Direction[],
  state: GameState
): GameState | null => {
  if (collisions.includes(Direction.DOWN) && isAboveGameField(block, state.gameField.rows)) {
    return {
      ...state,
      activeBlock: block,
      gameLevelState: GameLevelState.LOST,
    };
  }
  return null;
};

const getProjectedPosition = (block: Block, state: GameState) => {
  let newBlock = block;

  while (
      !checkCollision(newBlock, state.blocks, state.gameField).includes(
          Direction.DOWN
      )
      ) {
    newBlock = blockFactory(
        block.type,
        {
          ...newBlock.anchor,
          row: newBlock.anchor.row - 1,
        },
        newBlock.orientation
    );
  }
  return newBlock;
}

const spawnBlock = (state: GameState, nextBlock: BlockType) => {
  const block = blockFactory(state.nextBlock, {
    row: state.gameField.rows - 1,
    col: Math.floor(state.gameField.cols / 2),
  });
  // Currently this is only relevant for the I block, because its anchor is not part of its lowest row.
  const blockSpawnPositioned = blockFactory(block.type, {col: block.anchor.col, row: state.gameField.rows + state.gameField.rows - 2 - getHighestCell(block).row});
  if (checkOverlap(blockSpawnPositioned, state.blocks, state.gameField)) {
    return {
      ...state,
      activeBlock: blockSpawnPositioned,
      gameLevelState: GameLevelState.LOST,
      nextBlock
    };
  }
  const activeBlockProjectedCells = getProjectedPosition(blockSpawnPositioned, state).cells!;
  return {
    ...state,
    activeBlock: blockSpawnPositioned,
    activeBlockProjectedCells,
    nextBlock
  };
}

const tryToTurnBlock = (state: GameState, newOrientation: Direction): Block => {
  let updatedActiveBlock = blockFactory(
      state.activeBlock!.type,
      state.activeBlock!.anchor,
      newOrientation
  );
  if(!checkOverlap(updatedActiveBlock, state.blocks, state.gameField) && !isOutOfBounds(updatedActiveBlock, state.gameField.cols)) {
      return updatedActiveBlock;
  }

  let repositionedBlock = state.activeBlock!;
  const colAdjustments = [-1, 1, -2, 2];
  for(const adjustment of colAdjustments) {
    repositionedBlock = blockFactory(
        state.activeBlock!.type,
        {...state.activeBlock!.anchor, col: state.activeBlock!.anchor.col + adjustment},
        newOrientation
    );
    if(!checkOverlap(repositionedBlock, state.blocks, state.gameField) && !isOutOfBounds(repositionedBlock, state.gameField.cols)) {
      break;
    }
  }
  return repositionedBlock;
}
