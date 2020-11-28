import {Block, BlockType, Direction} from "../model/GameFieldModel";
import styled from "styled-components";
import {blockFactory} from "../factory/BlockFactory";
import {zipRange} from "../utils/ListUtils";
import React, {useCallback} from "react";

export type BlockPreviewComponentProps = {
    blockType: BlockType;
}

export const BlockPreviewComponent = (props: BlockPreviewComponentProps) => {
    const rows = 5, cols = 5;

    const getBlockGridPosition = useCallback((blockType: BlockType) => {
        switch(blockType) {
            case BlockType.I:
                return {row: rows - 3, col: 2}
            case BlockType.J:
                return {row: rows - 3, col: 2}
            case BlockType.L:
                return {row: rows - 3, col: 2}
            case BlockType.O:
                return {row: rows - 2, col: 1}
            case BlockType.S:
                return {row: rows - 3, col: 2}
            case BlockType.Z:
                return {row: rows - 3, col: 2}
            case BlockType.T:
                return {row: rows - 3, col: 2}
        }
    }, []);

    const block = blockFactory(props.blockType, getBlockGridPosition(props.blockType), props.blockType === BlockType.I ? Direction.RIGHT : Direction.UP);

    return (
        <BlockPreviewWrapper>
            <NextBlockTitle>Next Block:</NextBlockTitle>
            <BlockPreviewCellGridWrapper>
                <BlockPreviewCellGrid>
                    {zipRange(rows, cols)
                        .map(([row, col]) => [rows - 1 - row, col])
                        .map(([row, col]) => {
                        const blockInCell = block.cells!.some(({row: cellRow, col: cellCol}) => row === cellRow && col === cellCol) ? block : undefined;
                        return <BlockPreviewCell key={row + "_" + col} block={blockInCell}/>
                    })}
                </BlockPreviewCellGrid>
            </BlockPreviewCellGridWrapper>
        </BlockPreviewWrapper>
    )
}

const BlockPreviewWrapper = styled.div`
  padding: 1em;
  margin-top: 1.0em;
  border: 1px solid black;
  border-radius: 0.2em;
`

const NextBlockTitle = styled.div`
  font-size: 1.5em;
`

const BlockPreviewCellGridWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const BlockPreviewCellGrid = styled.div`
  margin-top: 1.5em;
  display: grid;
  grid-template-rows: repeat(5, 2em);
  grid-template-columns: repeat(5, 2em);
`

type BlockPreviewCellProps = {
    block?: Block;
}

const BlockPreviewCell = styled.div`
  border: ${(props: BlockPreviewCellProps) => props.block ? '2px' : '0'} solid black;
  background-color: ${(props: BlockPreviewCellProps) => props.block ? props.block.color : 'white'};
`
