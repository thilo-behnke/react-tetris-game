import {BlockType} from "../model/GameFieldModel";
import styled from "styled-components";
import React from "react";
import {BlockPreviewComponent} from "./BlockPreviewComponent";

export type HudComponentProps = {
    nextBlock: BlockType;
    score: number;
};

export const HudComponent = (props: HudComponentProps) => {
    return (
        <HudWrapper>
            <StyledScore>{props.score}</StyledScore>
            <BlockPreviewComponent blockType={props.nextBlock}/>
        </HudWrapper>
    );
};

const HudWrapper = styled.div`
  grid-area: controls;
  border: 1px solid royalblue;
  border-radius: 1em;
  padding: 10px;

  > * + * {
    margin-top: 10px;
  }
`;

const StyledScore = styled.div`
  font-size: 2em;
  border: 1px solid grey;
  border-radius: 0.5em;
  text-align: center;
`
