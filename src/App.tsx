import React from "react";
import "./App.css";
import { GameField } from "./components/GameField";
import styled from "styled-components";
import {
  DefaultRandomNumberGenerator,
  RandomNumberGeneratorContext,
} from "./random/RandomNumberGenerator";

function App() {
  return (
    <RandomNumberGeneratorContext.Provider
      value={new DefaultRandomNumberGenerator()}
    >
      <StyledGameFieldWrapper>
        <GameField cols={11} rows={16} />
      </StyledGameFieldWrapper>
    </RandomNumberGeneratorContext.Provider>
  );
}

export const StyledGameFieldWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export default App;
