import { IDomino } from "./domino";
import { IDominoLocation, ITile, ITileLocation, TileKind } from "./tile";

/** y
 *x    -4 -3 -2 -1 0 1 2 3 4
 * -4  .
 * -3     .
 * -2        . 
 * -1           .
 *  0             c
 *  1               .
 *  2                 .
 *  3                   .
 *  4                     .
 * 
*/
export type IKingdom = ReadonlyArray<ReadonlyArray<ITile | undefined>>;
type IEditableKingdom = Array<Array<ITile | undefined>>;

export function getNewKingdom(): IKingdom {
    const tiles: IEditableKingdom = [];
    for (var x of [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
        tiles[x] = [];
        for (var y of [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
            tiles[x][y] = undefined;
        }
    }
    tiles[0][0] = { kind: TileKind.castle, crowns: 0 };
    return tiles;
}

export function locationsEqual(first: IDominoLocation, second: IDominoLocation) {
    return first.locA.x === second.locA.x &&
        first.locA.y === second.locA.y &&
        first.locB.x === second.locB.x &&
        first.locB.y === second.locB.y;
}

export function getTileAt(k: IKingdom, loc: ITileLocation) {
    return k?.[loc.x]?.[loc.y];
}

export function locationAvailable(k: IKingdom, loc: IDominoLocation): boolean {
    return getTileAt(k, loc.locA) === undefined && getTileAt(k, loc.locB) === undefined;
}

/**       x  x  x  x x x x x x
 *       -4 -3 -2 -1 0 1 2 3 4
 * y -4   A  B  D            
 * y -3   A  B  D            
 * y -2         
 * y -1           
 * y  0             C
 * y  1               .
 * y  2                 .
 * y  3                   .Y Z
 * y  4                    Y Z
 * 
*/
export function forEachVerticalDominoLocation(action: (location: IDominoLocation) => void) {
    for (var x of [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
        for (var y of [-4, -3, -2, -1, 0, 1, 2, 3]) {
            action({ locA: { x, y }, locB: { x: x, y: y + 1 } });
        }
    }
}

/**       x  x  x  x  x  x  x  x  x
 *       -4 -3 -2 -1  0  1  2  3  4
 * y -4   A  A  B  B  C  C     G  G              
 * y -3                        F  F    
 * y -2                                
 * y -1                             
 * y  0             C              
 * y  1               .                
 * y  2                 .            
 * y  3                   .        
 * y  4                        Z  Z
 * 
*/
export function forEachHorizontalDominoLocation(action: (location: IDominoLocation) => void) {
    for (var x of [-4, -3, -2, -1, 0, 1, 2, 3]) {
        for (var y of [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
            action({ locA: { x: x, y }, locB: { x: x + 1, y } });
        }
    }
}

export function kingdomWouldBeValidSize(k: IKingdom, testLoc: IDominoLocation): boolean {

    for (var x of [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
        var columnCount = 0;
        if (testLoc.locA.x === x) {
            columnCount++;
        }
        if (testLoc.locB.x === x) {
            columnCount++;
        }
        for (var y of [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
            var rowCount = 0;
            if (testLoc.locA.y === y) {
                rowCount++;
            }
            if (testLoc.locB.y === y) {
                rowCount++;
            }
            if (!!getTileAt(k, { x, y })) {
                columnCount++;
                rowCount++;
                if (columnCount > 5 || rowCount > 5) {
                    return false;
                }
            }
        }
    }
    return true;
}


/**       x  x  x  
 *       -4 -3 -2 
 * y -4                     
 * y -3      B               
 * y -2         
 */
function getLeftTile(k: IKingdom, t: ITileLocation) {
    return k?.[t.x - 1]?.[t.y];
}

function getRightTile(k: IKingdom, t: ITileLocation) {
    return k?.[t.x + 1]?.[t.y];
}

function getUpTile(k: IKingdom, t: ITileLocation) {
    return k?.[t.x]?.[t.y - 1];
}

function getDownTile(k: IKingdom, t: ITileLocation) {
    return k?.[t.x]?.[t.y + 1];
}

function tilesMatch(a?: ITile, b?: ITile) {
    return !!a &&
        !!b &&
        !!a.kind &&
        !!b.kind &&
        (a.kind === b.kind || a.kind === TileKind.castle || b.kind === TileKind.castle);
}

function verticalDominoMatches(k: IKingdom, domino: IDomino, loc: IDominoLocation) {

    // loop to flip the domino in the opposite orientation
    for (const testLoc of [
        { locA: loc.locA, locB: loc.locB },
        { locA: loc.locB, locB: loc.locA }]) {

        const topTileMatches =
            tilesMatch(domino.tileA, getUpTile(k, testLoc.locA)) ||
            tilesMatch(domino.tileA, getLeftTile(k, testLoc.locA)) ||
            tilesMatch(domino.tileA, getRightTile(k, testLoc.locA));

        const bottomTileMatches =
            tilesMatch(domino.tileB, getDownTile(k, testLoc.locB)) ||
            tilesMatch(domino.tileB, getLeftTile(k, testLoc.locB)) ||
            tilesMatch(domino.tileB, getRightTile(k, testLoc.locB));

        if (topTileMatches || bottomTileMatches) {
            return true;
        }
    }
    return false;
}

function horizontalDominoMatches(k: IKingdom, domino: IDomino, loc: IDominoLocation) {

    // loop to flip the domino in the opposite orientation
    for (const testLoc of [
        { locA: loc.locA, locB: loc.locB },
        { locA: loc.locB, locB: loc.locA }]) {

        const leftTileMatches =
            tilesMatch(domino.tileA, getUpTile(k, testLoc.locA)) ||
            tilesMatch(domino.tileA, getLeftTile(k, testLoc.locA)) ||
            tilesMatch(domino.tileA, getDownTile(k, testLoc.locA));

        const rightTileMatches =
            tilesMatch(domino.tileB, getUpTile(k, testLoc.locB)) ||
            tilesMatch(domino.tileB, getRightTile(k, testLoc.locB)) ||
            tilesMatch(domino.tileB, getDownTile(k, testLoc.locB));

        if (leftTileMatches || rightTileMatches) {
            return true;
        }
    }
    return false;
}

export function getValidLocations(k: IKingdom, domino: IDomino): { vertical: IDominoLocation[], horizontal: IDominoLocation[] } {

    const valid: { vertical: IDominoLocation[], horizontal: IDominoLocation[] } = { vertical: [], horizontal: [] }

    forEachVerticalDominoLocation((testLoc) => {
        if (locationAvailable(k, testLoc) &&
            verticalDominoMatches(k, domino, testLoc) &&
            kingdomWouldBeValidSize(k, testLoc)) {
            valid.vertical.push(testLoc);
        }
    });

    forEachHorizontalDominoLocation((testLoc) => {
        if (locationAvailable(k, testLoc) &&
            horizontalDominoMatches(k, domino, testLoc) &&
            kingdomWouldBeValidSize(k, testLoc)) {
            valid.horizontal.push(testLoc);
        }
    });

    return valid;
}

export function isValidLocation(k: IKingdom, d: IDomino, testLoc: IDominoLocation) {
    const valid = getValidLocations(k, d);
    return undefined !== [...valid.horizontal, ...valid.vertical].find(c => locationsEqual(c, testLoc));
}

/** @returns a new Kingdom with the given Domino placed at the given Location if the Location is valid */
export function placeDomino(k: IKingdom, d: IDomino, dLoc: IDominoLocation): IKingdom {
    const updated:IEditableKingdom = [...k.map(a => [...a])];
    if (isValidLocation(k, d, dLoc)) {
        updated[dLoc.locA.x][dLoc.locA.y] = d.tileA;
        updated[dLoc.locB.x][dLoc.locB.y] = d.tileB;
    }
    return updated;
}

export function kingdomToJSON(k: ReadonlyArray<ReadonlyArray<ITile>>) {
    return JSON.stringify(k);
}

export function kingdomToString(k: IKingdom) {
    let s = "\n";
    s += "  -4-3-2-1 0 1 2 3 4";
    s += "\n";
    for (let y = -4; y < 5; y++) {
        s += y >= 0 ? " " + y : y;
        for (let x = -4; x < 5; x++) {
            const tile = k?.[x]?.[y];
            if (tile === undefined) {
                s += " .";
            } else if (tile.kind === TileKind.castle) {
                s += " C";
            } else if (tile.kind === TileKind.forest) {
                s += " F";
            } else if (tile.kind === TileKind.field) {
                s += " f";
            } else if (tile.kind === TileKind.mine) {
                s += " M";
            } else if (tile.kind === TileKind.swamp) {
                s += " S";
            } else if (tile.kind === TileKind.water) {
                s += " w";
            } else if (tile.kind === TileKind.wheat) {
                s += " W";
            } else {
                s += " ?";
            }
        }
        s += "\n";
    }
    return s;
}