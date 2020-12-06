import { zipRange } from "../utils/ListUtils";
import {Block, Coordinates} from "../model/GameFieldModel";
import React from "react";
import styled from "styled-components";

export type CellsComponentProps = {
  blocks: Block[];
  projectedCells: Coordinates[];
  gameField: { rows: number; cols: number };
};
export const CellsComponent = (props: CellsComponentProps) => {
  return (
    <React.Fragment>
      {zipRange(props.gameField.rows, props.gameField.cols)
        .map(([row, col]) => [props.gameField.rows - 1 - row, col])
        .map(([row, col]) => {
          const allBlocks = props.blocks.filter(Boolean) as Block[];
          const blockAtPosition = allBlocks.find(({ cells }) =>
            cells!.find(
              ({ col: cellCol, row: cellRow }) =>
                cellCol === col && cellRow === row
            )
          );
          const isProjectedCell = props.projectedCells.some(({row: projectedRow, col: projectedCol}) => row === projectedRow && col === projectedCol);
          const cellIsMarkedForDestruction = blockAtPosition?.cells!.find(({row: cellRow, col: cellCol}) => row === cellRow && col === cellCol)?.isMarkedForDestruction;
          return (
            <StyledCell
              key={col + "-" + row}
              color={blockAtPosition ? blockAtPosition.color : isProjectedCell ? 'lightgrey' : undefined}
              highlightBorder={!!blockAtPosition}
              shouldDestroy={cellIsMarkedForDestruction}
            />
          );
        })}
    </React.Fragment>
  );
};

export type StyledCellProps = {
  color?: string;
  highlightBorder: boolean;
  shouldDestroy?: boolean;
};

export const StyledCell = styled.div`
  @keyframes vaporize-block {
    0% {
      transform: scaleY(1);
    }
    20% {
      transform: scaleY(1.3);
    }
    100% {
      transform: scaleY(0);
    }
  }

  border: ${(props: StyledCellProps) => (props.highlightBorder ? "2px" : "1px")} solid
    ${(props: StyledCellProps) => (props.highlightBorder ? "black" : "grey")};
  background-color: ${(props: StyledCellProps) => props.color || null};
  animation: ${(props: StyledCellProps) =>
    props.shouldDestroy ? "vaporize-block 300ms linear" : "none"};
`;
