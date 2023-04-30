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
export type IKingdom = ReadonlyMap<number, ReadonlyMap<number, ITile | undefined>>;
type IEditableKingdom = Map<number, Map<number, ITile | undefined>>;

export function getNewKingdom(): IKingdom {
    const tiles: IEditableKingdom = new Map();
    for (var x of [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
        tiles.set(x, new Map());
        for (var y of [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
            tiles.get(x)?.set(y, undefined);
        }
    }
    tiles.get(0)!.set(0, { kind: TileKind.castle, crowns: 0 });
    return tiles;
}

export function tileLocationsEqual(first: ITileLocation, second: ITileLocation) {
    return first.x === second.x && first.y === second.y;
}

export function dominoLocationsEqual(first: IDominoLocation, second: IDominoLocation) {
    return (
        (tileLocationsEqual(first.locA, second.locA) && tileLocationsEqual(first.locB, second.locB))
        || (tileLocationsEqual(first.locA, second.locB) && tileLocationsEqual(first.locB, second.locA))
    );
}

export function getAt(k: IKingdom, loc: ITileLocation) {
    return k?.get(loc.x)?.get(loc.y);
}

export function hasTile(k: IKingdom, loc: ITileLocation) {
    return getAt(k, loc) !== undefined;
}

export function locationAvailable(k: IKingdom, loc: IDominoLocation): boolean {
    return getAt(k, loc.locA) === undefined && getAt(k, loc.locB) === undefined;
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

const tileRange: ReadonlyArray<number> = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

export function getTileCountForX(k: IKingdom, x: number) {
    let count = 0;
    for (const y of tileRange) {
        if (hasTile(k, { x, y }))
            count++
    }
    return count;
}

export function getTileCountForY(k: IKingdom, y: number) {
    let count = 0;
    for (const x of tileRange) {
        if (hasTile(k, { x, y }))
            count++
    }
    return count;
}

export function tileIsOverLimit(k: IKingdom, loc: ITileLocation, otherLoc: ITileLocation) {
    let yCount = getTileCountForY(k, loc.y);
    let xCount = getTileCountForX(k, loc.x);
    // account for loc Tile
    yCount++;
    xCount++;
    // account for other Tile
    if (loc.x === otherLoc.x) xCount++;
    if (loc.y === otherLoc.y) yCount++;

    return yCount > 5 || xCount > 5;
}

export function kingdomWouldBeValidSize(k: IKingdom, testLoc: IDominoLocation): boolean {
    return !tileIsOverLimit(k, testLoc.locA, testLoc.locB) && !tileIsOverLimit(k, testLoc.locB, testLoc.locA);
}


/**       x  x  x  
 *       -4 -3 -2 
 * y -4                     
 * y -3      B               
 * y -2         
 */
function getLeftTile(k: IKingdom, t: ITileLocation) {
    return k?.get(t.x - 1)?.get(t.y);
}

function getRightTile(k: IKingdom, t: ITileLocation) {
    return k?.get(t.x + 1)?.get(t.y);
}

function getUpTile(k: IKingdom, t: ITileLocation) {
    return k?.get(t.x)?.get(t.y - 1);
}

function getDownTile(k: IKingdom, t: ITileLocation) {
    return k?.get(t.x)?.get(t.y + 1);
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
            verticalDominoMatches(k, domino, testLoc)
            && kingdomWouldBeValidSize(k, testLoc)
        ) {
            valid.vertical.push(testLoc);
        }
    });

    forEachHorizontalDominoLocation((testLoc) => {
        if (locationAvailable(k, testLoc) &&
            horizontalDominoMatches(k, domino, testLoc)
            && kingdomWouldBeValidSize(k, testLoc)
        ) {
            valid.horizontal.push(testLoc);
        }
    });

    return valid;
}

export function isValidLocation(k: IKingdom, d: IDomino, testLoc: IDominoLocation) {
    const valid = getValidLocations(k, d);
    return undefined !== [...valid.horizontal, ...valid.vertical].find(c => dominoLocationsEqual(c, testLoc));
}

/** @returns a new Kingdom with the given Domino placed at the given Location if the Location is valid */
export function placeDomino(k: IKingdom, d: IDomino, dLoc: IDominoLocation): IKingdom {
    const updated: IEditableKingdom = deepCloneKingdom(k);
    if (!isValidLocation(k, d, dLoc)) {
        throw new Error("Invalid location.");
    }
    updated.get(dLoc.locA.x)!.set(dLoc.locA.y, d.tileA);
    updated.get(dLoc.locB.x)!.set(dLoc.locB.y, d.tileB);
    return updated;
}

export function kingdomToJavaScript(k: IKingdom) {
    return "not implemented";
}

export function locationsToString(dLocs: IDominoLocation[]) {
    let s = "\n";
    for (const loc of dLocs) {
        s += `(${loc.locA.x}, ${loc.locA.y}), (${loc.locB.x}, ${loc.locB.y})\n`;
    }
    return s;
}

export function kingdomToString(k: IKingdom) {
    let s = "\n";
    s += "  -4-3-2-1 0 1 2 3 4";
    s += "\n";
    for (let y = -4; y < 5; y++) {
        s += y >= 0 ? " " + y : y;
        for (let x = -4; x < 5; x++) {
            const tile = getAt(k, { x, y });
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

function deepCloneKingdom<K, V>(map: ReadonlyMap<K, ReadonlyMap<K, V>>): Map<K, Map<K, V>> {
    const clone = new Map<K, Map<K, V>>();
    for (const [key, value] of map.entries()) {
        const nestedClone = new Map<K, V>();
        for (const [nestedKey, nestedValue] of value.entries()) {
            nestedClone.set(nestedKey, nestedValue);
        }
        clone.set(key, nestedClone);
    }
    return clone;
}


