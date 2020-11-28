import {Block, BlockType, Direction} from "../model/GameFieldModel";
import styled from "styled-components";
import {blockFactory} from "../factory/BlockFactory";
import {zipRange} from "../utils/ListUtils";
import React, {useCallback} from "react";

export type BlockPreviewComponentProps = {
    blockType: BlockType;
}

export const BlockPreviewComponent = (props: BlockPreviewComponentProps) => {
    const getBlockGridPosition = useCallback((blockType: BlockType) => {
        switch(blockType) {
            case BlockType.I:
                return {row: 2, col: 2}
            case BlockType.J:
                return {row: 0, col: 2}
            case BlockType.L:
                return {row: 0, col: 2}
            case BlockType.O:
                return {row: 1, col: 1}
            case BlockType.S:
                return {row: 0, col: 2}
            case BlockType.Z:
                return {row: 0, col: 2}
            case BlockType.T:
                return {row: 0, col: 2}
        }
    }, []);

    const block = blockFactory(props.blockType, getBlockGridPosition(props.blockType), props.blockType === BlockType.I ? Direction.RIGHT : Direction.UP);

    return (
        <div>
            <NextBlockTitle>Next Block:</NextBlockTitle>
            <BlockPreviewWrapper>
                <BlockPreviewCellGrid>
                    {zipRange(5, 5).map(([row, col]) => {
                        const blockInCell = block.cells!.some(({row: cellRow, col: cellCol}) => row === cellRow && col === cellCol) ? block : undefined;
                        return <BlockPreviewCell key={row + "_" + col} block={blockInCell}/>
                    })}
                </BlockPreviewCellGrid>
            </BlockPreviewWrapper>
        </div>
    )
}

const NextBlockTitle = styled.div`
  margin-top: 1.2em;
  font-size: 1.5em;
`

const BlockPreviewWrapper = styled.div`
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
  border: ${(props: BlockPreviewCellProps) => props.block ? '1px' : '0'} solid grey;
  background-color: ${(props: BlockPreviewCellProps) => props.block ? props.block.color : 'white'};
`
