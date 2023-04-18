import { Domino, DominoState, DominoStateAction, findDomino, getDominos, getNextDominoState as setDominoState, dominosOfState as dominosOfState } from "./domino";


export enum GameState {

    Initialized = "Initialized",

    Claim1_Player1 = "Claim1_Player1",
    Place1_Player1 = "Place1_Player1",

    Claim1_Player2 = "Claim1_Player2",
    Place1_Player2 = "Place1_Player2",

    Place2_Player1 = "Place2_Player1",
    Claim2_Player1 = "Claim2_Player1",

    Place2_Player2 = "Place2_Player2",
    Claim2_Player2 = "Claim2_Player2",

    // If Dominos in Deck, Go To InitializeRound

    // determine winner
    GameOver = "GameOver",
}

export enum GameStateAction {
    Initialize,

    Claim_Player1,
    Claim_Player2,

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
    player1?: string;
    player2?: string;
    player?:string;
    dominoRank?: number;
}

export function executeGameAction(action: GameStateAction, actionData: IActionData, gameData?: IGameData): IGameData {

    if (action === GameStateAction.Initialize) {
        if(!actionData.player1 || !actionData.player2)
            throw new Error(`Players must be specified.`);

        const newData:IGameData = {
            player1: actionData.player1,
            player2: actionData.player2,
            dominos: getDominos(),
            state: GameState.Claim1_Player1,
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

    if (!gameData)
        throw new Error(`Command ${action} requires data.`);

    switch (gameData.state) {
        case GameState.Claim1_Player1:
            if (action === GameStateAction.Claim_Player1) {
                const newData = {
                    ...gameData,
                    state: GameState.Claim1_Player2,
                }
                const picked = findDomino(newData.dominos, actionData!.dominoRank!);
                picked!.state = setDominoState(picked!.state!, DominoStateAction.ClaimByPlayer);
                picked!.pickedBy = actionData.player;
                return newData;
            }
            throw new Error(`Waiting on Player 1 to Pick.`);
    }
    throw new Error(`Action ${action} with Action Data ${JSON.stringify(actionData)} is not valid for current State ${gameData.state}.`);
}