import { Domino, DominoState, DominoStateAction, findDomino, getDominos, getNextDominoState as setDominoState, ofState as dominosOfState } from "./domino";


export enum GameState {

    Initialized,

    Place1_Player1,
    Pick1_Player1,

    Place1_Player2,
    Pick1_Player2,

    Place2_Player1,
    Pick2_Player1,

    Place2_Player2,
    Pick2_Player2,

    // If Dominos in Deck, Go To InitializeRound

    // determine winner
    EndGame,
}

export enum GameStateAction {
    Initialize,

    Pick_Player1,
    Pick_Player2,

    Place_Player1,
    Place_Player2,
}

export interface IGameData {
    state: GameState;
    dominos: Domino[];
    player1: string;
    player2: string;
}



export function getNextGameState(action: GameStateAction, actionData: any, data: IGameData): IGameData {

    if (action === GameStateAction.Initialize) {
        const newData = {
            ...data,
            dominos: getDominos(),
            state: GameState.Pick1_Player1,
        };

        // move 24 dominos out of game
        dominosOfState(newData.dominos, DominoState.Uninitialized)
            .slice(0, 24)
            .forEach(d => d.state = setDominoState(d.state, DominoStateAction.PlaceOutOfGame));

        // move 24 dominos in draw pile
        dominosOfState(newData.dominos, DominoState.Uninitialized)
            .slice(0, 24)
            .forEach(d => d.state = setDominoState(d.state, DominoStateAction.PlaceInDrawPile));

        // move four dominos into the Pick List
        dominosOfState(newData.dominos, DominoState.InDrawPile)
            .slice(0, 4)
            .forEach(d => d.state = setDominoState(d.state, DominoStateAction.PlaceInPickList));
    }

    switch (data.state) {
        case GameState.Pick1_Player1:
            if (action === GameStateAction.Pick_Player1) {
                const newData = {
                    ...data,
                    state: GameState.Pick1_Player2,
                }
                const picked = findDomino(newData.dominos, actionData.rank);
                picked!.state = setDominoState(picked!.state!, DominoStateAction.ClaimByPlayer);
                return newData;
            }
            throw new Error(`Waiting on Player 1 to Pick.`);
    }
    throw new Error(`Invalid action or state data.`);
}