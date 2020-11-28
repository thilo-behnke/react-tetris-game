import ReactModal from "react-modal";
import React from "react";
import styled from "styled-components";

export type GameStateModalProps = {
  show: boolean;
  message: string;
  onRestart: () => void;
};

export const GameStateModal = (props: GameStateModalProps) => {
  const { message, onRestart, show } = props;

  const customStyles = {
    content: {
      height: "100px",
      width: "300px",
      top: "10%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  return (
    <ReactModal ariaHideApp={false} isOpen={show} style={customStyles}>
      <StyledContent>
        {message}
        <RestartButton onClick={onRestart}>Restart?</RestartButton>
      </StyledContent>
    </ReactModal>
  );
};

const StyledContent = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;
`;

const RestartButton = styled.button`
  font-size: 1em;
  padding: 5px 10px;
  color: white;
  border: 1px solid coral;
  background-color: coral;
  border-radius: 4px;
  cursor: pointer;
`;
