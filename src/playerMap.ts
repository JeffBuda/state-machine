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
export type IKingdom = (ITile | undefined)[][];

export function getNewKingdom(): IKingdom {
    const tiles: IKingdom = [];
    for (var x in [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
        for (var y in [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
            tiles[x][y] = null;
        }
    }
    tiles[0][0] = { kind: TileKind.castle, crowns: 0 };
    return tiles;
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
    for (var x1 of [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
        for (var y1 of [-4, -3, -2, -1, 0, 1, 2, 3]) {
            for (var x2 of [-4, -3, -2, -1, 0, 1, 2, 3, 4]) {
                for (var y2 of [-3, -2, -1, 0, 1, 2, 3, 4]) {
                    action({locA: {x: x1, y: y1}, locB: {x: x2, y: y2}});
                }
            }
        }
    }
}



/**       x  x  x  
 *       -4 -3 -2 
 * y -4                     
 * y -3      B               
 * y -2         
 */
function getLeftTile(k: IKingdom, t: ITileLocation) {
    return k[t.x - 1][t.y];
}

function getRightTile(k: IKingdom, t: ITileLocation) {
    return k[t.x + 1][t.y];
}

function getUpTile(k: IKingdom, t: ITileLocation) {
    return k[t.x][t.y - 1];
}

function getDownTile(k: IKingdom, t: ITileLocation) {
    return k[t.x][t.y + 1];
}

function tilesMatch(a?: ITile, b?: ITile) {
    return a && b && a.kind === b.kind;
}

/**  */
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

export function canPlaceAt(k:IKingdom, loc: IDominoLocation): boolean {

    // for each orientation of the tile (aUp, aDown, aLeft, aRight)
    forEachVerticalDomino(k, () => {

    });

    // for each of tileA, tileB

    // if a tile exist at this location
    //  return false;

    // if this placement makes the kingdom wider than 5 tiles
    //  return false;

    // if this placement would make the kingdom taller than 5 tiles
    //  return false;

    // if tileA does not match an adjacent tile AND tileB does not match an adjacent tile
    // return false; //exclude the other tile in the domino of course

    return true;
}

