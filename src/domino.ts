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
        public state: DominoState,
        public stateDetail?: string) {
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

function shuffle<T>(a: Array<T>): Array<T> {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function getDominos() {
    const dominos = [
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.wheat, 0), 1, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.wheat, 0), 2, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.forest, 0), 3, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.forest, 0), 4, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.forest, 0), 5, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.forest, 0), 6, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.water, 0), new Tile(TileKind.water, 0), 7, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.water, 0), new Tile(TileKind.water, 0), 8, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.water, 0), new Tile(TileKind.water, 0), 9, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.field, 0), new Tile(TileKind.field, 0), 10, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.field, 0), new Tile(TileKind.field, 0), 11, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.swamp, 0), new Tile(TileKind.swamp, 0), 12, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.forest, 0), 13, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.water, 0), 14, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.field, 0), 15, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.swamp, 0), 16, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.water, 0), 17, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 0), new Tile(TileKind.field, 0), 18, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 1), new Tile(TileKind.forest, 0), 19, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 1), new Tile(TileKind.water, 0), 20, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 1), new Tile(TileKind.field, 0), 21, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 1), new Tile(TileKind.swamp, 0), 22, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 1), new Tile(TileKind.mine, 0), 23, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.wheat, 0), 24, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.wheat, 0), 25, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.wheat, 0), 26, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.wheat, 0), 27, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.water, 0), 28, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.forest, 1), new Tile(TileKind.field, 0), 29, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.wheat, 0), 30, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.wheat, 0), 31, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.forest, 0), 32, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.forest, 0), 33, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.forest, 0), 34, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.water, 1), new Tile(TileKind.forest, 0), 35, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.field, 1), 36, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.water, 0), new Tile(TileKind.field, 1), 37, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.swamp, 1), 38, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.field, 0), new Tile(TileKind.swamp, 1), 39, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.mine, 1), new Tile(TileKind.wheat, 0), 40, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.field, 2), 41, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.water, 0), new Tile(TileKind.field, 2), 42, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.swamp, 2), 43, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.field, 0), new Tile(TileKind.swamp, 2), 44, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.mine, 2), new Tile(TileKind.wheat, 0), 45, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.swamp, 0), new Tile(TileKind.mine, 2), 46, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.swamp, 0), new Tile(TileKind.mine, 2), 47, DominoState.Uninitialized),
        new Domino(new Tile(TileKind.wheat, 0), new Tile(TileKind.mine, 3), 48, DominoState.Uninitialized)
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

export function dominosOfState(dominos:Domino[], state:DominoState) {
    return dominos.filter(d => d.state === state);
}
