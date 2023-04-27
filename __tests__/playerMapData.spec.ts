import { PlayerMapData } from '../src/playerMapData';
import { Domino, DominoLocation, DominoState } from "../src/domino";
import { Tile, TileKind, TileLocation } from "../src/tile";
import { GameError } from '../src/playerMapData';

describe("the map", () => {
    describe("immediately after construction", () => {
        it("has a castle tile at 0,0", () => {
            let map = new PlayerMapData();
            expect(map.getAt(new TileLocation(0, 0))).toBe(TileKind.castle);
        });

        it("should not have any other tiles", () => {
            let map = new PlayerMapData();
            expect(map.getAt(new TileLocation(-1, -1))).toBe(undefined);
        });
    });
    describe("the toString function", () => {
        it("will print an empty map", () => {
            let map = new PlayerMapData();
            let emptyMap = `\n  -4-3-2-1 0 1 2 3 4
-4 . . . . . . . . .
-3 . . . . . . . . .
-2 . . . . . . . . .
-1 . . . . . . . . .
 0 . . . . C . . . .
 1 . . . . . . . . .
 2 . . . . . . . . .
 3 . . . . . . . . .
 4 . . . . . . . . .\n`;
            expect(map.toString()).toBe(emptyMap);
        });
    });
    describe("during the game", () => {
        it("should only allow a space to be occupied exactly once by one tile", () => {
            let map = new PlayerMapData();
            expect(() => {
                map.setAt(new TileLocation(0, 0), new Tile(TileKind.forest, 0));
            }).toThrow(new Error(GameError.locationOccupied));
        });
    });
    describe("tileMatches() function", () => {
        it("allows any tile to match with the castle tile", () => {
            let map = new PlayerMapData();
            expect(map.getAt(new TileLocation(0, 0))).toBe(TileKind.castle);
            expect(map.tileMatches(new TileLocation(0, 0), new Tile(TileKind.forest, 0))).toBe(false);
            expect(map.tileMatches(new TileLocation(0, 1), new Tile(TileKind.forest, 0))).toBe(true);
            expect(map.tileMatches(new TileLocation(0, -1), new Tile(TileKind.forest, 0))).toBe(true);
            expect(map.tileMatches(new TileLocation(1, 0), new Tile(TileKind.forest, 0))).toBe(true);
            expect(map.tileMatches(new TileLocation(-1, 0), new Tile(TileKind.forest, 0))).toBe(true);
        });
        it("returns false when the tiles are not adjacent tiles", () => {
            let map = new PlayerMapData();
            expect(map.tileMatches(new TileLocation(5, 5), new Tile(TileKind.forest, 0))).toBe(false);
        });
        it("returns true when two of the same tiles are adjacent", () => {
            let map = new PlayerMapData();
            map.setAt(new TileLocation(1, 0), new Tile(TileKind.forest, 0));
            expect(map.tileMatches(new TileLocation(2, 0), new Tile(TileKind.forest, 0))).toBe(true);
        });
        it("returns false for two tiles of differing kinds", () => {
            let map = new PlayerMapData();
            map.setAt(new TileLocation(1, 0), new Tile(TileKind.water, 0));
            expect(map.tileMatches(new TileLocation(2, 0), new Tile(TileKind.forest, 0))).toBe(false);
        });
    });
    describe("canSetDominoAt() function", () => {
        it("will not allow the game to be wider than 5 tiles taking into account all rows", () => {
            let map = new PlayerMapData();
            map.setDominoAt(new DominoLocation(
                new TileLocation(0, 1),
                new TileLocation(1, 1)),
                new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.forest, 0), 0, DominoState.InPlacementList));
            map.setDominoAt(
                new DominoLocation(
                    new TileLocation(-2,
                        1),
                    new TileLocation(
                        -1,
                        1)),
                new Domino(
                    new Tile(TileKind.forest, 0),
                    new Tile(TileKind.forest, 0),
                    0, DominoState.InPlacementList));
            // map is 4 squares wide at this point...
            expect(() => {
                map.setDominoAt(
                    new DominoLocation(
                        new TileLocation(-2,
                            1),
                        new TileLocation(-3,
                            1)),
                    new Domino(
                        new Tile(TileKind.forest, 0),
                        new Tile(TileKind.forest, 0),
                        0, DominoState.InPlacementList))
                )
        })
            .toThrow(new Error(GameError.locationInvalid));
    });

    it("allows any domino to be placed adjacent to the castle", () => {
        let map = new PlayerMapData();
        expect(
            map.canSetDominoAt(
                new DominoLocation(new TileLocation(0,
                    1),
                    new TileLocation(0,
                        2)),
                new Domino(new Tile(TileKind.forest, 0),
                    new Tile(TileKind.forest, 0), 0, DominoState.InPlacementList)
            )
        ).toBe(true);
    });
    it("requires dominos to be placed adjacent another domino", () => {
        let map = new PlayerMapData();
        expect(
            map.canSetDominoAt(
                3,
                1,
                3,
                2,
                new Domino(TileKind.forest, TileKind.forest)
            )
        ).toBe(false);
    });

    it("allows matching dominos to be placed adjacent to each other", () => {
        let map = new PlayerMapData();
        map.setDominoAt(0, 1, 0, 2, new Domino(TileKind.forest, TileKind.water));
        map.setDominoAt(0, 3, 0, 4, new Domino(TileKind.water, TileKind.field));
        expect(map.getAt(0, 1)).toBe(TileKind.forest);
        expect(map.getAt(0, 2)).toBe(TileKind.water);
        expect(map.getAt(0, 3)).toBe(TileKind.water);
        expect(map.getAt(0, 4)).toBe(TileKind.field);
    });
    it("prevents not matching dominos to be placed adjacent to each other", () => {
        let map = new PlayerMapData();
        map.setDominoAt(0, 1, 0, 2, new Domino(TileKind.forest, TileKind.water));
        expect(map.getAt(0, 1)).toBe(TileKind.forest);
        expect(map.getAt(0, 2)).toBe(TileKind.water);
        expect(() => {
            map.setDominoAt(
                0,
                3,
                0,
                4,
                new Domino(TileKind.field, TileKind.forest)
            );
        }).toThrow(new Error(GameError.locationInvalid));
    });
    it("does not allow a domino to be placed on the castle", () => {
        let map = new PlayerMapData();
        expect(
            map.canSetDominoAt(
                0,
                0,
                0,
                1,
                new Domino(TileKind.forest, TileKind.forest)
            )
        ).toBe(false);
    });
    it("does not allow the map to be wider than 5 tiles", () => {
        let map = new PlayerMapData();
        map.setDominoAt(0, 1, 0, 2, new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.water, 0), 0));
        map.setDominoAt(0, 3, 0, 4, new Domino(new Tile(TileKind.water, 0), new Tile(TileKind.field, 0), 0));

        expect(() => {
            map.setDominoAt(0, 5, 0, 6, new Domino(TileKind.field, TileKind.field, 0));
        }).toThrow(new Error(GameError.locationInvalid));
    });
});
});