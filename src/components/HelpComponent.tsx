import React, {useEffect, useState} from "react";
import {HelpCircle, X} from "react-feather";
import styled from "styled-components";
import ReactModal from "react-modal";

export type HelpComponentProps = {
    onHelpToggle: (isOpen: boolean) => void;
}

export const HelpComponent = (props: HelpComponentProps) => {
    const {onHelpToggle} = props;
    const [showHelp, setShowHelp] = useState<boolean>(false);

    useEffect(() => {
        onHelpToggle(showHelp);
    }, [showHelp, onHelpToggle]);

    const customStyles = {
        content: {
            height: "500px",
            width: "500px",
            top: "25%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
        },
    };

    return <StyledHelpComponentWrapper>
        <HelpCircleWrapper onClick={() => setShowHelp(true)}><HelpCircle/></HelpCircleWrapper>
        <ReactModal style={customStyles} isOpen={showHelp} ariaHideApp={false} shouldCloseOnEsc={true}>
            <ModalWrapper>
                <CloseIcon onClick={() => setShowHelp(false)}/>
                <ModalContent>
                    <h2>Welcome to Reactris!</h2>
                    <h3>Key Bindings:</h3>
                    <ol>
                        <li>Move block left/right: Arrow left/right</li>
                        <li>Move block down: Arrow down (hold to move down faster)</li>
                        <li>Crash block down: Double tap arrow up</li>
                        <li>Turn current block: Space</li>
                        <li>Hold current block: Ctrl</li>
                    </ol>
                </ModalContent>
            </ModalWrapper>
        </ReactModal>
    </StyledHelpComponentWrapper>
}

const StyledHelpComponentWrapper = styled.div`
  align-self: flex-end;
  justify-self: flex-end;
`

const ModalWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
`

const CloseIcon = styled(X)`
  align-self: flex-end;
  cursor: pointer;
`

const ModalContent = styled.div`
  margin-top: 2em;
  
  > h2 {
    text-align: center;
    margin-bottom: 2em;
  }
`

const HelpCircleWrapper = styled.button`
  padding: 0;
  margin: 0;
  height: 24px;
  border-radius: 1em;
  border: 0;
  cursor: pointer;
  background-color: white;
`

