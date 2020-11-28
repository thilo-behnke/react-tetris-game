import { Block, BlockType, Direction } from "../model/GameFieldModel";
import { blockFactory } from "../factory/BlockFactory";
import { checkCollision, checkOverlap } from "./CollisionChecker";

describe("GameFieldUtils", () => {
  describe("GameFieldUtils.checkCollision", () => {
    const rows = 10;
    const cols = 10;

    it("should detect no collision for empty field", () => {
      // given
      const activeBlock: Block = blockFactory(BlockType.I, { row: 5, col: 5 });
      const blocks: Block[] = [];
      // when
      const res = checkCollision(activeBlock, blocks, { rows, cols });
      // then
      expect(res).toEqual([]);
    });
    it("should detect collision with other block", () => {
      // given
      const activeBlock: Block = blockFactory(BlockType.I, { row: 5, col: 5 });
      const blocks: Block[] = [blockFactory(BlockType.I, { row: 6, col: 5 })];
      // when
      const res = checkCollision(activeBlock, blocks, { rows, cols });
      // then
      expect(res).toEqual([Direction.DOWN]);
    });
    it("should detect collisions with multiple blocks", () => {
      // given
      const activeBlock: Block = blockFactory(BlockType.I, { row: 5, col: 5 });
      const blocks: Block[] = [
        blockFactory(BlockType.I, { row: 6, col: 5 }),
        blockFactory(BlockType.I, { row: 5, col: 6 }),
      ];
      // when
      const res = checkCollision(activeBlock, blocks, { rows, cols });
      // then
      expect(res.sort()).toEqual([Direction.RIGHT, Direction.DOWN]);
    });
    it("should detect collisions with game field borders", () => {
      // given
      const activeBlock: Block = blockFactory(BlockType.I, { row: 5, col: 0 });
      const blocks: Block[] = [];
      // when
      const res = checkCollision(activeBlock, blocks, { rows, cols });
      // then
      expect(res.sort()).toEqual([Direction.LEFT]);
    });
    it("should detect collisions with game field borders and other blocks", () => {
      // given
      const activeBlock: Block = blockFactory(BlockType.I, { row: 5, col: 0 });
      const blocks: Block[] = [
        blockFactory(BlockType.I, { row: 6, col: 0 }),
        blockFactory(BlockType.I, { row: 5, col: 1 }),
      ];
      // when
      const res = checkCollision(activeBlock, blocks, { rows, cols });
      // then
      expect(res.sort()).toEqual([
        Direction.RIGHT,
        Direction.DOWN,
        Direction.LEFT,
      ]);
    });
  });
  describe("GameFieldUtils.checkOverlap", () => {
    const rows = 10;
    const cols = 10;

    it("should detect no overlap for empty field", () => {
      // given
      const activeBlock: Block = blockFactory(BlockType.I, { row: 5, col: 5 });
      const blocks: Block[] = [];
      // when
      const res = checkOverlap(activeBlock, blocks, { rows, cols });
      // then
      expect(res).toEqual(false);
    });
    it("should detect overlap with other block", () => {
      // given
      const activeBlock: Block = blockFactory(BlockType.I, { row: 5, col: 5 });
      const blocks: Block[] = [blockFactory(BlockType.I, { row: 4, col: 5 })];
      // when
      const res = checkOverlap(activeBlock, blocks, { rows, cols });
      // then
      expect(res).toEqual(true);
    });
    it("should detect overlap with bounds", () => {
      // given
      const activeBlock: Block = blockFactory(
        BlockType.I,
        { row: 5, col: 0 },
        Direction.LEFT
      );
      const blocks: Block[] = [];
      // when
      const res = checkOverlap(activeBlock, blocks, { rows, cols });
      // then
      expect(res).toEqual(true);
    });
    it("should detect overlap with bounds and block", () => {
      // given
      const activeBlock: Block = blockFactory(
        BlockType.I,
        { row: 5, col: 0 },
        Direction.LEFT
      );
      const blocks: Block[] = [blockFactory(BlockType.I, { row: 4, col: 0 })];
      // when
      const res = checkOverlap(activeBlock, blocks, { rows, cols });
      // then
      expect(res).toEqual(true);
    });
  });
});
