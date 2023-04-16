import { Tile, TileKind } from "./tile";

export enum DominoState {
    Uninitialized = "Uninitialized",

    /** No available for play, ie two player game */
    OutOfGame = "NotInGame",

    /** Not revealed but will be eventually */
    InDrawPile = "InDrawPile",

    /** Revealed, in the current round, not yet claimed by any Player*/
    InPickList_Available = "InCurrentRoundAvailable",

    /** Revealed, in current round, and claimed by a Player */
    InPickList_Claimed = "Claimed By Player",

    /** In the list if dominos to be placed by Players in this round */
    InPlacementList = "In Placement List",

    /** Placed by a player in their kingdom */
    InKingdom = "In Kingdom",
}


export function getNextDominoState(state: DominoState, action: DominoStateAction) {
    switch (state) {

        case DominoState.Uninitialized:
            if (action === DominoStateAction.PlaceInDrawPile)
                return DominoState.InDrawPile;
            if (action === DominoStateAction.PlaceOutOfGame)
                return DominoState.OutOfGame;
            throw new Error(`Uninitialized cards can ony go in the Draw Pile or Out of the Game.`);

        case DominoState.InDrawPile:
            if (action === DominoStateAction.PlaceInPickList)
                return DominoState.InPickList_Available;
            throw new Error(`Dominos in the Draw Pile can only move to the Pick List.`);

        case DominoState.InPickList_Available:
            if (action === DominoStateAction.ClaimByPlayer)
                return DominoState.InPickList_Claimed;
            throw new Error(`Available Dominos in the Pick List can only move to the Claimed state.`);
    
        case DominoState.InPickList_Claimed:
            if(action === DominoStateAction.PlaceInKingdom)
                return DominoState.InKingdom;
            throw new Error(`Claimed Dominos can only move to the In Kingdom state.`);

        case DominoState.OutOfGame:
        case DominoState.InKingdom:
            throw new Error(`${state} is an end state.`);

        default:
            throw new Error(`Cannot transition from ${state} via ${action}.`);
    }
}

export class Domino {
    constructor(
        public readonly tileA: Tile,
        public readonly tileB: Tile,
        public readonly rank: number,
        public state?: DominoState,
        public stateDetail?: string) {
        if (!state) {
            this.state = DominoState.Uninitialized;
        }
    }
    public toString(): string {
        return `Domino ${this.rank} with ${this.tileA} and ${this.tileB} (${this.state} ${this.stateDetail})`;
    }
}

export function sortByRank(d1: Domino, d2: Domino) {
    if (d1.rank > d2.rank) {
        return 1;
    } else if (d1.rank < d2.rank) {
        return -1;
    }
    return 0;
}
export function drawForNewRound(dominos: Array<Domino>) {
    dominos.filter(d => d.state === DominoState.InDrawPile)
        .slice(0, 4)
        .forEach(d => d.state = DominoState.InPickList_Available);
}

export function getDominos() {
    const dominos = [
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.wheat, 0), 1),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.wheat, 0), 2),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.forest, 0), 3),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.forest, 0), 4),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.forest, 0), 5),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.forest, 0), 6),
        new Domino(new Tile(TileKind.water, 0), new Tile(TileKind.water, 0), 7),
        new Domino(new Tile(TileKind.water, 0), new Tile(TileKind.water, 0), 8),
        new Domino(new Tile(TileKind.water, 0), new Tile(TileKind.water, 0), 9),
        new Domino(new Tile(TileKind.field, 0), new Tile(TileKind.field, 0), 10),
        new Domino(new Tile(TileKind.field, 0), new Tile(TileKind.field, 0), 11),
        new Domino(new Tile(TileKind.swamp, 0), new Tile(TileKind.swamp, 0), 12),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.forest, 0), 13),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.water, 0), 14),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.field, 0), 15),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.swamp, 0), 16),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.water, 0), 17),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.field, 0), 18),
        new Domino(new Tile(TileKind.wheat, 1), new Tile(TileKind.forest, 0), 19),
        new Domino(new Tile(TileKind.wheat, 1), new Tile(TileKind.water, 0), 20),
        new Domino(new Tile(TileKind.wheat, 1), new Tile(TileKind.field, 0), 21),
        new Domino(new Tile(TileKind.wheat, 1), new Tile(TileKind.swamp, 0), 22),
        new Domino(new Tile(TileKind.wheat, 1), new Tile(TileKind.mine, 0), 23),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.wheat, 0), 24),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.wheat, 0), 25),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.wheat, 0), 26),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.wheat, 0), 27),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.water, 0), 28),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.field, 0), 29),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.wheat, 0), 30),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.wheat, 0), 31),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.forest, 0), 32),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.forest, 0), 33),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.forest, 0), 34),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.forest, 0), 35),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.field, 1), 36),
        new Domino(new Tile(TileKind.water, 0), new Tile(TileKind.field, 1), 37),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.swamp, 1), 38),
        new Domino(new Tile(TileKind.field, 0), new Tile(TileKind.swamp, 1), 39),
        new Domino(new Tile(TileKind.mine, 1), new Tile(TileKind.wheat, 0), 40),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.field, 2), 41),
        new Domino(new Tile(TileKind.water, 0), new Tile(TileKind.field, 2), 42),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.swamp, 2), 43),
        new Domino(new Tile(TileKind.field, 0), new Tile(TileKind.swamp, 2), 44),
        new Domino(new Tile(TileKind.mine, 2), new Tile(TileKind.wheat, 0), 45),
        new Domino(new Tile(TileKind.swamp, 0), new Tile(TileKind.mine, 2), 46),
        new Domino(new Tile(TileKind.swamp, 0), new Tile(TileKind.mine, 2), 47),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.mine, 3), 48)
    ];
    return shuffle(dominos);
}

export enum DominoStateAction {
    PlaceOutOfGame,
    PlaceInDrawPile,
    PlaceInPickList,
    ClaimByPlayer,
    PlaceInKingdom,
}

export function findDomino(dominos:Domino[], rank:number) {
    return dominos.find(d => d.rank === rank);
} 
