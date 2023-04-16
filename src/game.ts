
export enum GamePlayer {
    Player1,
    Player2,
    Player3,
    Player4
}

export enum GameStateName {

    // get and shuffle 24 dominos
    InitializeGame,

    // reveal the first four dominos
    // at first players only pick, they don't place

    // lay out the next group of four dominos
    InitializeRound,

    Player1_Place1,
    Player1_Pick1,

    Player2_Place1,
    Player2_Pick1,

    Player1_Place2,
    Player1_Pick2,

    Player2_Place2,
    Player2_Pick2,

    // If Dominos in Deck, Go To InitializeRound

    // determine winner
    EndGame,
}
export enum Domino {

}

export interface IGameData {
    currentPlayer: GamePlayer;
    dominosHidden: Domino[];
    dominosVisible: Domino[];
}

export interface IGameState {
    name: GameStateName;
    getNextState(data: IGameData): { state: GameStateName, data: IGameData };
}

export const State_InitializeGame:IGameState = {
    name: GameStateName.InitializeGame,
    getNextState: (data:IGameData) => {

        (function preconditions() {
            if (data) throw new Error("Initial state is calculated.")
        })();

        return {
            state: GameStateName.InitializeRound,
            data: {
                currentPlayer: GamePlayer.Player1, //TODO: randomize first player
                dominosVisible: [],
                dominosHidden: [] //TODO: populate w/ 24 dominos
            }
        };
    }
};
export const State_InitializeRound =         {
    name: GameStateName.InitializeRound,
    getNextState: (data:IGameData) => {

        const beforeHiddenCount = data.dominosHidden.length;
        const beforeVisibleCount = data.dominosHidden.length;
        const dominoCount = beforeHiddenCount + beforeVisibleCount;

        (function preconditions(){
            if(!data) throw new Error("Data is required.");
        })();

        const newState = {
            state: GameStateName.Player1_Pick1, //TODO: calc which player OR 
            data: {
                ...data,
                dominosVisible: [], //TODO: get four dominos from Hidden
                dominosHidden: [] //TODO: remaining Hidden
            }
        };

        (function postConditions(){
            if(data.dominosHidden.length + data.dominosVisible.length !== dominoCount)
                new Error("A domino is missing.");
            if(data.dominosVisible.length !== 4)
                new Error("Four dominos should be visible.");
            if(data.dominosHidden.length == beforeHiddenCount - 4)
                new Error("Four fewer dominos should be hidden.");
        })();

        return newState;
    }
};

export interface INextStates {
    [key: string]: IGameState;
}

export function getNextState(current:GameStateName, data:IGameData):{state:GameStateName, data:IGameData} {
    const states:INextStates = {};

    states[GameStateName.InitializeGame] = State_InitializeGame;
    states[GameStateName.InitializeRound] = State_InitializeRound;
    
    const next = states[current].getNextState(data);
    return {state: next.state, data: next.data};
}