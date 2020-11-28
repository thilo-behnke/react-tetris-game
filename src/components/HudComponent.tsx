import {BlockType} from "../model/GameFieldModel";
import styled from "styled-components";
import React from "react";
import {BlockPreviewComponent} from "./BlockPreviewComponent";
import {HelpComponent} from "./HelpComponent";

export type HudComponentProps = {
    nextBlock: BlockType;
    score: number;
    onPause: (isPaused: boolean) => void;
};

export const HudComponent = (props: HudComponentProps) => {
    return (
        <HudWrapper>
            <div style={{flex: "1 0 auto"}}>
                <StyledScore>{props.score}</StyledScore>
                <BlockPreviewComponent blockType={props.nextBlock}/>
            </div>
            <HelpComponent onHelpToggle={props.onPause}/>
        </HudWrapper>
    );
};

const HudWrapper = styled.div`
  grid-area: controls;
  border: 1px solid black;
  border-radius: 1em;
  padding: 10px;
  
  display: flex;
  flex-flow: column nowrap;

  > * + * {
    margin-top: 10px;
  }
`;

const StyledScore = styled.div`
  font-size: 2em;
  border: 1px solid black;
  border-radius: 0.2em;
  text-align: center;
`
