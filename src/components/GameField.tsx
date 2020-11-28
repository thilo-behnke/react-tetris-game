import styled from "styled-components";
import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { BlockType, Direction, GameLevelState } from "../model/GameFieldModel";
import { isWithinGameField } from "../utils/GameFieldUtils";
import { GameStateModal } from "./GameStateModal";
import {
  createInitialState,
  GameStateReducer,
} from "../reducer/GameStateReducer";
import { CellsComponent } from "./CellsComponent";
import { RandomNumberGeneratorContext } from "../random/RandomNumberGenerator";
import { usePrev } from "../hooks/UsePrev";
import { HudComponent } from "./HudComponent";
import {useDoubleClick} from "../hooks/UseDoubleClick";

export type GameFieldProps = {
  rows: number;
  cols: number;
};

export const GameField = (props: GameFieldProps) => {
  const gameFieldEl = useRef(null);
  useEffect(() => {
    (gameFieldEl.current as any).focus();
  });

  const randomNumberGenerator = useContext(RandomNumberGeneratorContext);

  const getRandomBlock = useCallback(() => {
    return randomNumberGenerator.getRandomNumber({
      max: Object.values(BlockType).length / 2,
    });
  }, [randomNumberGenerator]);

  const [state, dispatch] = useReducer(
    GameStateReducer,
    createInitialState(props.rows, props.cols, getRandomBlock())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if(state.gameLevelState !== GameLevelState.RUNNING) {
        return;
      }
      dispatch({
        type: "move_active_block",
        payload: Direction.DOWN,
      });
    }, 1_000);
    return () => clearInterval(interval);
  }, [state.gameLevelState]);

  useEffect(() => {
    if (state.activeBlock) {
      return;
    }
    const blockType = getRandomBlock();

    dispatch({
      type: "add_block",
      payload: blockType,
    });
  }, [state.activeBlock, getRandomBlock]);

  useEffect(() => {
    if (!state.cellsMarkedForDestruction.length) {
      return;
    }
    setTimeout(() => {
      dispatch({ type: "destroy_marked_cells" });
    }, 200);
  }, [state.cellsMarkedForDestruction]);

  const handleKeyDown = (e: any) => {
    if (
      !state.activeBlock ||
      !isWithinGameField(state.activeBlock, state.gameField.rows) ||
      state.gameLevelState !== GameLevelState.RUNNING
    ) {
      return;
    }
    switch (e.keyCode) {
      case 37:
        dispatch({ type: "move_active_block", payload: Direction.LEFT });
        return;
      case 39:
        dispatch({ type: "move_active_block", payload: Direction.RIGHT });
        return;
      case 40:
        dispatch({ type: "move_active_block", payload: Direction.DOWN });
        return;
    }
  };

  const handleKeyUp = (e: any) => {
    if (
        !state.activeBlock ||
        !isWithinGameField(state.activeBlock, state.gameField.rows) ||
        state.gameLevelState !== GameLevelState.RUNNING
    ) {
      return;
    }

    switch (e.keyCode) {
      case 17:
        dispatch({ type: "hold_active_block" });
        return;
      case 32:
        dispatch({ type: "turn_active_block", payload: Direction.DOWN });
        return;
    }
  }

  const doubleClickRegistered = useDoubleClick(
      gameFieldEl,
      38
  );

  usePrev(({prevDeps}) => {
    if (
        !state.activeBlock ||
        !isWithinGameField(state.activeBlock, state.gameField.rows) ||
        state.gameLevelState !== GameLevelState.RUNNING
    ) {
      return;
    }
    if(!doubleClickRegistered || prevDeps[0]) {
      return;
    }
    dispatch({type: 'crash_active_block'})
  }, [doubleClickRegistered, state.activeBlock, state.gameField.rows])

  const restart = () => {
    dispatch({ type: "restart", payload: getRandomBlock() });
  };

  const togglePause = useCallback((shouldPause: boolean) => {
    dispatch({type: "toggle_pause", payload: shouldPause});
  }, []);

  return (
    <React.Fragment>
      <GameStateModal
        show={state.gameLevelState === GameLevelState.LOST}
        message={"You lost!"}
        onRestart={restart}
      />
      <GameFieldWrapper>
        <StyledGameField
          ref={gameFieldEl}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          tabIndex={0}
          cols={props.cols}
          rows={props.rows}
        >
          <CellsComponent
            gameField={state.gameField}
            blocks={[
              ...state.blocks,
              ...(state.activeBlock ? [state.activeBlock] : []),
            ]}
            projectedCells={state.activeBlockProjectedCells || []}
          />
        </StyledGameField>
        <HudComponent score={state.score} nextBlock={state.nextBlock} onPause={togglePause} />
      </GameFieldWrapper>
    </React.Fragment>
  );
};

export const GameFieldWrapper = styled.div`
  min-height: 100%;
  margin-top: 20px;
  justify-content: stretch;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  grid-column-gap: 20px;
  grid-template-areas: "left game controls right";
`;

export const StyledGameField = styled.div`
  grid-area: game;
  display: grid;
  grid-template-columns: repeat(${(props: GameFieldProps) => props.cols}, 40px);
  grid-template-rows: repeat(${(props: GameFieldProps) => props.rows}, 40px);
`;