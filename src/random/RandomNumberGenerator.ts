import React from "react";

export interface RandomNumberGenerator {
  getRandomNumber: ({ max, min }: { max: number; min?: number }) => number;
}

export class DefaultRandomNumberGenerator implements RandomNumberGenerator {
  getRandomNumber({ max, min = 0 }: { max: number; min?: number }): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
}

export class StaticNumberGenerator implements RandomNumberGenerator {
  getRandomNumber({ max, min }: { max: number; min?: number }): number {
    return 6;
  }
}

export const RandomNumberGeneratorContext = React.createContext<RandomNumberGenerator>(
  new DefaultRandomNumberGenerator()
);
