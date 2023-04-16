import { Domino, DominoState, DominoStateAction, findDomino, getDominos, getNextDominoState as setDominoState, dominosOfState as dominosOfState } from "./domino";


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

export interface IActionData {
    player1: string;
    player2: string;
    dominoRank?: number;
}

export function executeGameAction(action: GameStateAction, actionData: IActionData, data?: IGameData): IGameData {

    if (action === GameStateAction.Initialize) {
        if(!actionData.player1 || !actionData.player2)
            throw new Error(`Players must be specified.`);

        const newData:IGameData = {
            player1: actionData.player1,
            player2: actionData.player2,
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
        
        return newData;
    }

    if (!data)
        throw new Error(`Command ${action} requires data.`);

    switch (data.state) {
        case GameState.Pick1_Player1:
            if (action === GameStateAction.Pick_Player1) {
                const newData = {
                    ...data,
                    state: GameState.Pick1_Player2,
                }
                const picked = findDomino(newData.dominos, actionData!.dominoRank!);
                picked!.state = setDominoState(picked!.state!, DominoStateAction.ClaimByPlayer);
                return newData;
            }
            throw new Error(`Waiting on Player 1 to Pick.`);
    }
    throw new Error(`Invalid action or state data.`);
}