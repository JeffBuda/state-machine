import { TileLocation } from "./tile";

export class PlayerMap {
    constructor() {

    }

    setDominoAt(tileA: TileLocation, tileB: TileLocation) {

    }

    canPlaceAt(tileA: TileLocation, tileB: TileLocation): boolean {
        
        // for each orientation of the tile (aUp, aDown, aLeft, aRight)

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
}

