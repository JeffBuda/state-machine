import { Domino, DominoState, DominoStateAction, findDomino, getDominos, getNextDominoState as setDominoState, dominosOfState as dominosOfState, initializeDominos } from "./domino";
import { createMachine, assign, interpret } from 'xstate';
import { AnyEventObject, BaseActionObject, Interpreter, ResolveTypegenMeta, ServiceMap, TypegenDisabled } from 'xstate';

export namespace guards {
    export function every(...guards: string[]) {
        return function every(context: any, event: any, meta: any) { return guards.every(key => meta.state.machine.options.guards[key](context, event, meta)) }
    }
    export function some(...guards: string[]) {
        return function some(context: any, event: any, meta: any) { return guards.some(key => meta.state.machine.options.guards[key](context, event, meta)) }
    }
}

export interface IInitializeActionData {
    playerNames: string[];
}

export interface IActionData {
    playerId: number;
    dominoId: number;
}

export enum PMState {
    claim = 'claim',
    place = 'place',
    gameOver = 'gameOver'
};

export enum PMAction {
    playerClaimsDomino = 'playerClaimsDomino'
}

export enum PMEvent {
    playerClaimsDomino = 'playerClaimsDomino'
}


export enum PMGuards {
    isEventPlayersTurn = 'isPlayersTurn',
    allPlayersHaveClaimed = 'allPlayersHaveClaimed',
    isEventDominoAvailable = "dominoIsAvailable",
    isInitialClaimRound = "isInitialClaimRound",
    isLastPlayerInSequence = "isLastPlayerInSequence"
}

export interface PMContext {
    players: string[];
    currentPlayer: string;
    playerClaimSequence: string[];
    dominos: Domino[];
    isInitialClaimRound: boolean;
}


export type PlayerManagerType = Interpreter<PMContext, any, AnyEventObject, {
    value: any;
    context: PMContext;
}, ResolveTypegenMeta<TypegenDisabled, AnyEventObject, BaseActionObject, ServiceMap>>;


export type DominoEvent = { type: PMEvent.playerClaimsDomino, player: string, dominoId: number }

export function createPlayerManager() {

    const machine = createMachine<PMContext>({

        predictableActionArguments: true,
        id: 'playerManager',
        initial: PMState.claim,

        context: {
            players: ['jeff', 'dave'],
            currentPlayer: 'jeff',
            playerClaimSequence: ['jeff', 'dave'],
            dominos: initializeDominos(),
            isInitialClaimRound: true
        },

        states: {
            [PMState.claim]: {
                on: {
                    [PMAction.playerClaimsDomino]: [
                        {
                            cond: guards.every(
                                PMGuards.isEventPlayersTurn,
                                PMGuards.isEventDominoAvailable,
                                PMGuards.isInitialClaimRound,
                                PMGuards.isLastPlayerInSequence),
                            target: PMState.place,
                            actions:[
                                assign(context => { return { isInitialClaimRound: false } }),
                                assign((context, event: DominoEvent) => {

                                    // update the player sequence to indicate this player has taken his turn
                                    return updateContextForClaimedDomino(context, event);
                                })
                            ]

                        },
                        {
                            // in the initial claim round allow a player to claim a token
                            // then move onto the next player in the player sequence
                            cond: guards.every(
                                PMGuards.isEventPlayersTurn,
                                PMGuards.isEventDominoAvailable,
                                PMGuards.isInitialClaimRound),
                            target: PMState.claim,
                            actions:
                                assign((context, event: DominoEvent) => {

                                    // update the player sequence to indicate this player has taken his turn
                                    return updateContextForClaimedDomino(context, event);
                                })
                        }
                    ],
                }
            },
            [PMState.place]: {},
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
                [PMGuards.isEventPlayersTurn]: (context, event) => {
                    const dominoEvent = event as DominoEvent;
                    return context.currentPlayer === dominoEvent.player;
                },
                [PMGuards.isLastPlayerInSequence]: (context, event) => {
                    const dominoEvent = event as DominoEvent;
                    return context.playerClaimSequence.length === 1 && 
                    context.playerClaimSequence[0] === dominoEvent.player;
                },
                [PMGuards.isEventDominoAvailable]: (context, event) => {
                    const dominoEvent = event as DominoEvent;
                    return findDomino(context.dominos, dominoEvent.dominoId)?.state === DominoState.InPickList_Available;
                },
                [PMGuards.isInitialClaimRound]: (context, event) => {
                    return context.isInitialClaimRound;
                }
            },
            services: {
                /* ... */
            }
        });
    const instance = interpret(machine);
    instance.start();
    return instance;
}

function updateContextForClaimedDomino(context: PMContext, event: DominoEvent) {
    const newSequence = [...context.playerClaimSequence];
    newSequence.shift();

    // update the domino to indicate that he claimed it
    const newDominos = [...context.dominos];
    findDomino(newDominos, event.dominoId)!.pickedBy = event.player;

    return {
        playerClaimSequence: newSequence,
        currentPlayer: newSequence[0]
    };
}

export function getPMContext(playerManager: PlayerManagerType) { return playerManager.machine.context };

export interface IPlayerManager {
    execute(event: DominoEvent): void;
}
