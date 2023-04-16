import { Domino, DominoStateAction, findDomino, getDominos, getNextDominoState } from "./domino";


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



export function getNextGameState(action: GameStateAction, actionData:any, data: IGameData): IGameData {

    if (action === GameStateAction.Initialize) {
        return {
            ...data,
            dominos: getDominos(),
            state: GameState.Pick1_Player1,
        };
    }

    switch (data.state) {
        case GameState.Pick1_Player1:
            if(action === GameStateAction.Pick_Player1) {
                const newData = {
                    ...data,
                    state: GameState.Pick1_Player2,
                }    
                const picked = findDomino(newData.dominos, actionData.rank);
                picked!.state = getNextDominoState(picked!.state!, DominoStateAction.ClaimByPlayer);
                return newData;
            }
            throw new Error(`Waiting on Player 1 to Pick.`);
    }
    throw new Error(`Invalid action or state data.`);
}