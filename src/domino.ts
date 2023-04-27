import { ITile, TileKind, ITileLocation } from "./tile";

export enum DominoState {
    Uninitialized = "Uninitialized",

    /** No available for play, ie two player game */
    OutOfGame = "OutOfGame",

    /** Not revealed but will be eventually */
    InDrawPile = "InDrawPile",

    /** Revealed, in the current round, not yet claimed by any Player*/
    InPickList_Available = "InPickList_Available",

    /** Revealed, in current round, and claimed by a Player */
    InPickList_Claimed = "InPickList_Claimed",

    /** In the list if dominos to be placed by Players in this round */
    InPlacementList = "InPlacementList",

    /** Placed by a player in their kingdom */
    InKingdom = "InKingdom",
}

export enum DominoStateAction {
    PlaceOutOfGame,
    PlaceInDrawPile,
    PlaceInPickList,
    ClaimByPlayer,
    PlaceInKingdom,
}

export function setDominoState(state: DominoState, action: DominoStateAction) {
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

export interface IDomino {
    readonly tileA: ITile;
    readonly tileB: ITile;
    readonly rank: number;
    state: DominoState;
    pickedBy?: string;
}

export function dominoToString(domino:IDomino): string {
    return `Domino ${domino.rank} with ${domino.tileA} and ${domino.tileB} (${domino.state} ${domino.pickedBy})`;
}


export function sortByRank(d1: IDomino, d2: IDomino) {
    if (d1.rank > d2.rank) {
        return 1;
    } else if (d1.rank < d2.rank) {
        return -1;
    }
    return 0;
}
export function drawForNewRound(dominos: Array<IDomino>) {
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

export function getDominosByState(dominos:IDomino[], state:DominoState) {
    return dominos.filter(d => d.state === state);
}

export function initializeDominos() {
    const dominos = getDominos();
    // move 24 dominos out of game
    getDominosByState(dominos, DominoState.Uninitialized)
        .slice(0, 24)
        .forEach(d => d.state = setDominoState(d.state, DominoStateAction.PlaceOutOfGame));

    // move 24 dominos in draw pile
    getDominosByState(dominos, DominoState.Uninitialized)
        .slice(0, 24)
        .forEach(d => d.state = setDominoState(d.state, DominoStateAction.PlaceInDrawPile));

    // move four dominos into the Pick List
    getDominosByState(dominos, DominoState.InDrawPile)
        .slice(0, 4)
        .forEach(d => d.state = setDominoState(d.state, DominoStateAction.PlaceInPickList));

    return dominos;
}

export function getDominos():IDomino[] {
    const dominos = [
        {tileA: {kind: TileKind.wheat, crowns:0}, tileB: {kind: TileKind.wheat, crowns: 0}, rank: 1, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:0}, tileB: {kind: TileKind.wheat, crowns: 0}, rank: 2, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:0}, tileB: {kind: TileKind.forest, crowns: 0}, rank: 3, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:0}, tileB: {kind: TileKind.forest, crowns: 0}, rank: 4, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:0}, tileB: {kind: TileKind.forest, crowns: 0}, rank: 5, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:0}, tileB: {kind: TileKind.forest, crowns: 0}, rank: 6, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.water, crowns:0}, tileB: {kind: TileKind.water, crowns: 0}, rank: 7, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.water, crowns:0}, tileB: {kind: TileKind.water, crowns: 0}, rank: 8, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.water, crowns:0}, tileB: {kind: TileKind.water, crowns: 0}, rank: 9, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.field, crowns:0}, tileB: {kind: TileKind.field, crowns: 0}, rank: 10, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.field, crowns:0}, tileB: {kind: TileKind.field, crowns: 0}, rank: 11, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.swamp, crowns:0}, tileB: {kind: TileKind.swamp, crowns: 0}, rank: 12, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:0}, tileB: {kind: TileKind.forest, crowns: 0}, rank: 13, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:0}, tileB: {kind: TileKind.water, crowns: 0}, rank: 14, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:0}, tileB: {kind: TileKind.field, crowns: 0}, rank: 15, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:0}, tileB: {kind: TileKind.swamp, crowns: 0}, rank: 16, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:0}, tileB: {kind: TileKind.water, crowns: 0}, rank: 17, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:0}, tileB: {kind: TileKind.field, crowns: 0}, rank: 18, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:1}, tileB: {kind: TileKind.forest, crowns: 0}, rank: 19, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:1}, tileB: {kind: TileKind.water, crowns: 0}, rank: 20, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:1}, tileB: {kind: TileKind.field, crowns: 0}, rank: 21, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:1}, tileB: {kind: TileKind.swamp, crowns: 0}, rank: 22, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:1}, tileB: {kind: TileKind.mine, crowns: 0}, rank:23, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:1}, tileB: {kind: TileKind.wheat, crowns: 0}, rank: 24, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:1}, tileB: {kind: TileKind.wheat, crowns: 0}, rank: 25, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:1}, tileB: {kind: TileKind.wheat, crowns: 0}, rank: 26, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:1}, tileB: {kind: TileKind.wheat, crowns: 0}, rank: 27, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:1}, tileB: {kind: TileKind.water, crowns: 0}, rank: 28, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.forest, crowns:1}, tileB: {kind: TileKind.field, crowns: 0}, rank: 29, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.water, crowns:1}, tileB: {kind: TileKind.wheat, crowns: 0}, rank:30, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.water, crowns:1}, tileB: {kind: TileKind.wheat, crowns: 0}, rank:31, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.water, crowns:1}, tileB: {kind: TileKind.forest, crowns: 0}, rank: 32, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.water, crowns:1}, tileB: {kind: TileKind.forest, crowns: 0}, rank: 33, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.water, crowns:1}, tileB: {kind: TileKind.forest, crowns: 0}, rank: 34, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.water, crowns:1}, tileB: {kind: TileKind.forest, crowns: 0}, rank:35, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:0}, tileB: {kind: TileKind.field, crowns: 1}, rank: 36, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.water, crowns:0}, tileB: {kind: TileKind.field, crowns: 1}, rank: 37, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:0}, tileB: {kind: TileKind.swamp, crowns: 1}, rank: 38, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.field, crowns:0}, tileB: {kind: TileKind.swamp, crowns: 1}, rank: 39, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.mine, crowns:1}, tileB: {kind: TileKind.wheat, crowns: 0}, rank: 40, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:0}, tileB: {kind: TileKind.field, crowns: 2}, rank: 41, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.water, crowns:0}, tileB: {kind: TileKind.field, crowns: 2}, rank: 42, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:0}, tileB: {kind: TileKind.swamp, crowns: 2}, rank: 43, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.field, crowns:0}, tileB: {kind: TileKind.swamp, crowns: 2}, rank:44, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.mine, crowns:2}, tileB: {kind: TileKind.wheat, crowns: 0}, rank: 45, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.swamp, crowns:0}, tileB: {kind: TileKind.mine, crowns: 2}, rank: 46, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.swamp, crowns:0}, tileB: {kind: TileKind.mine, crowns: 2}, rank: 47, state:DominoState.Uninitialized},
        {tileA: {kind: TileKind.wheat, crowns:0}, tileB: {kind: TileKind.mine, crowns: 3}, rank: 48, state:DominoState.Uninitialized}
    ];
    return shuffle(dominos);
}



export function findDomino(dominos:IDomino[], rank:number) {
    return dominos.find(d => d.rank === rank);
} 



export function calcDominoClaimed(dominos:IDomino[], playerName:string, dominoId:number) {
    // update the domino to indicate that he claimed it
    const newDominos = [...dominos];
    const domino = findDomino(newDominos, dominoId)!;
    domino.pickedBy = playerName;
    domino.state = setDominoState(domino.state, DominoStateAction.ClaimByPlayer);
    return newDominos;
}

export function calcDominoPlaced(dominos:IDomino[], playerName:string, dominoId:number) {
    // update the domino to indicate that he claimed it
    const newDominos = [...dominos];
    const domino = findDomino(newDominos, dominoId)!;
    domino.pickedBy = playerName;
    domino.state = setDominoState(domino.state, DominoStateAction.PlaceInKingdom);
    return newDominos;
}
