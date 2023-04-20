import { Domino, DominoState, DominoStateAction, findDomino, getDominos, getNextDominoState as setDominoState, dominosOfState as dominosOfState } from "./domino";
import { createMachine } from 'xstate';

export namespace guards{
    export function every(...guards:string[]){
      return function every(context:any, event:any, meta:any)
        {return guards.every(key => meta.state.machine.options.guards[key](context, event, meta))}
    }
    export function some(...guards:string[]){
      return function some(context:any, event:any, meta:any)
        {return guards.some(key => meta.state.machine.options.guards[key](context, event, meta))}
    }
  }
  
export enum GameState {
    Initialized = "Initialized",
    Claim = 'Claim',
    Place = 'Place',
    GameOver = 'GameOver',
}

export enum GameStateAction {
    Initialize,
    Claim,
    Place,
}

export interface IGameData {
    state: GameState;
    dominos: Domino[];
    playerNames: string[];

    isFirstRound: boolean; // first is a Claim-only round
    playerOrder: number[];
}

export interface IInitializeActionData {
    playerNames: string[];
}

export interface IActionData {
    playerId: number;
    dominoId: number;
}

enum PMState {
    initialClaimRound = 'initialClaimRound',
    placeAndClaim = 'placeAndClaim',
    gameOver = 'gameOver'
};

enum PMAction {
    playerClaimsDomino = 'playerClaimsDomino'
}

enum PMEvent {
    playerClaimsDomino = 'playerClaimsDomino'
}

enum PMGuards {
    isPlayersTurn = 'isPlayersTurn',
    allPlayersHaveClaimed = 'allPlayersHaveClaimed',
    dominoIsAvailable = "dominoIsAvailable"
}

interface IPMContext {
    players: string[];
    currentPlayer: string;
    playerClaimSequence: string[];
    dominos: Domino[];
}

type PlayerClaimsDominoEvent = { type: PMEvent.playerClaimsDomino, player: string, domino: number }

function initializeDominos() {
    const dominos = getDominos();
    // move 24 dominos out of game
    dominosOfState(dominos, DominoState.Uninitialized)
        .slice(0, 24)
        .forEach(d => d.state = setDominoState(d.state, DominoStateAction.PlaceOutOfGame));

    // move 24 dominos in draw pile
    dominosOfState(dominos, DominoState.Uninitialized)
        .slice(0, 24)
        .forEach(d => d.state = setDominoState(d.state, DominoStateAction.PlaceInDrawPile));

    // move four dominos into the Pick List
    dominosOfState(dominos, DominoState.InDrawPile)
        .slice(0, 4)
        .forEach(d => d.state = setDominoState(d.state, DominoStateAction.PlaceInPickList));

    return dominos;
}

export function stateMachine() {

    return createMachine<IPMContext>({

        id: 'playerManager',
        initial: PMState.initialClaimRound,

        context: {
            players: ['jeff', 'dave'],
            currentPlayer: 'jeff',
            playerClaimSequence: ['jeff', 'dave'],
            dominos: initializeDominos()
        },

        states: {
            [PMState.initialClaimRound]: {
                on: {
                    [PMAction.playerClaimsDomino]: [
                        {
                            cond: guards.every(PMGuards.isPlayersTurn, PMGuards.allPlayersHaveClaimed),
                            target: PMState.placeAndClaim
                        },
                        {
                            cond: guards.every(PMGuards.isPlayersTurn, PMGuards.
                            target: PMState.initialClaimRound
                        }
                    ],
                }
            },
            [PMState.placeAndClaim]: {},
            [PMState.gameOver]: {}
        }
    },
        {
            actions: {

            },
            delays: {
                /* ... */
            },
            guards: {
                [PMGuards.isPlayersTurn]: (context, event) => {
                    return context.currentPlayer === event.player;
                },
                [PMGuards.allPlayersHaveClaimed]: (context, _) => {
                    return context.playerClaimSequence.length === 0;
                },
                [PMGuards.dominoIsAvailable]: (context, event) => {
                    return findDomino(context.dominos, event.domino)?.state === DominoState.InPickList_Available;
                }
            },
            services: {
                /* ... */
            }
        });
}

// export function executeGameAction(
//     action: GameStateAction,
//     actionData: IInitializeActionData | IActionData,
//     gameData?: IGameData): IGameData {

//     if (action === GameStateAction.Initialize && isInitializeActionData(actionData)) {
//         const newData: IGameData = {
//             dominos: getDominos(),
//             state: GameState.Claim,
//             playerNames: [...actionData.playerNames],
//             isFirstRound: true,
//             playerOrder: [...Array(actionData.playerNames.length).keys()],
//         };



//         return newData;
//     }

//     if (!gameData)
//         throw new Error(`Command ${action} requires data.`);

//     switch (gameData.state) {
//         case GameState.Claim:

//             if (!isActionData(actionData))
//                 throw new Error(`Action Data required.`);
//             if (gameData.playerOrder[0] !== actionData.playerId)
//                 throw new Error(`It is ${gameData.playerNames[gameData.playerOrder[0]]}'s turn.`)

//             const newData: IGameData = {
//                 ...gameData,
//             };

//             // update state to track that the domino was claimed by the player
//             const picked = findDomino(newData.dominos, actionData!.dominoId!);
//             picked!.state = setDominoState(picked!.state!, DominoStateAction.ClaimByPlayer);
//             picked!.pickedBy = actionData.playerId;
//             const wasLastPlayer = gameData.playerOrder[gameData.playerOrder.length - 1] === actionData.playerId;
//             newData.state = wasLastPlayer ? GameState.Place
            
//             return newData;

//     }
//     throw new Error(`Waiting on Player 1 to Pick.`);
// }
// throw new Error(`Action ${action} with Action Data ${JSON.stringify(actionData)} is not valid for current State ${gameData.state}.`);
