import styled from "styled-components";
import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef, useState,
} from "react";
import {BlockType, Cell, Direction, GameLevelState} from "../model/GameFieldModel";
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

  const [movedOrTurned, setMovedOrTurned] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if(state.gameLevelState !== GameLevelState.RUNNING) {
        return;
      }
      dispatch({
        type: "move_active_block",
        payload: Direction.DOWN,
      });
    }, state.speed);
    return () => clearInterval(interval);
  }, [state.gameLevelState, state.speed]);

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

  const timer = useRef<number | null>(null);
  useEffect(() => {
    if(!state.activeBlockHasFloorContact) {
      if(timer.current) {
        clearTimeout(timer.current)
      }
      return;
    }
    if(movedOrTurned && timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      dispatch({ type: "update_field" });
    }, state.speed);

    return () => {
      if(timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [state.speed, timer, state.activeBlockHasFloorContact, movedOrTurned]);

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
        setMovedOrTurned(true);
        dispatch({ type: "move_active_block", payload: Direction.LEFT });
        return;
      case 39:
        setMovedOrTurned(true);
        dispatch({ type: "move_active_block", payload: Direction.RIGHT });
        return;
      case 40:
        setMovedOrTurned(true);
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
        setMovedOrTurned(true);
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
    dispatch({type: 'crash_active_block'});
    (gameFieldEl.current! as any).style.animation = "none";
    // TODO: Workaround, improve.
    setTimeout(() => {
      (gameFieldEl.current! as any).style.animation = "crash-down 0.3s linear";
    }, 0);
  }, [doubleClickRegistered, state.activeBlock, state.gameField.rows])

  const restart = () => {
    dispatch({ type: "restart", payload: getRandomBlock() });
  };

  const togglePause = useCallback((shouldPause: boolean) => {
    dispatch({type: "toggle_pause", payload: shouldPause});
  }, []);

  useEffect(() => {
    const markedForDestruction = state.blocks.reduce((acc: Cell[], {cells}) => [...acc, ...cells!], []).filter(({isMarkedForDestruction}) => isMarkedForDestruction);
    if(markedForDestruction.length) {
        setTimeout(() => {
            dispatch({type: "destroy_marked_cells"});
        }, 300)
    }
  }, [state.blocks, dispatch])

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
  @keyframes crash-down {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(10px);
    }
  }
  
  margin-top: 20px;
  justify-content: stretch;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  grid-column-gap: 20px;
  grid-template-areas: "left game controls right";
  
  position: absolute;
  //animation: example 0.2s linear;
`;

export const StyledGameField = styled.div`
  grid-area: game;
  display: grid;
  grid-template-columns: repeat(${(props: GameFieldProps) => props.cols}, 40px);
  grid-template-rows: repeat(${(props: GameFieldProps) => props.rows}, 40px);
`;
