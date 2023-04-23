import { Domino, DominoState, findDomino, getNextDominoState as setDominoState, dominosOfState as getDominosByState, initializeDominos } from "./domino";
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
    updatePlayerSequence = 'updatePlayerSequence',
    updatePlayerOrderForNewRound = "updatePlayerOrderForNewRound",
    updateCurrentPlayer = "updateCurrentPlayer",
    updateClaimedDomino = "updateClaimedDomino",
    updateInitialClaimRound = "updateInitialClaimRound"
}

export enum PMEvent {
    playerClaimsDomino = 'playerClaimsDomino',
    playerPlacesDomino = 'playerPlacesDomino'
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
    playerTurnOrder: string[];
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
            playerTurnOrder: ['jeff', 'dave'],
            dominos: initializeDominos(),
            isInitialClaimRound: true
        } as PMContext,

        states: {
            [PMState.claim]: {
                on: {
                    [PMEvent.playerClaimsDomino]: [
                        {
                            cond: guards.every(
                                PMGuards.isEventPlayersTurn,
                                PMGuards.isEventDominoAvailable,
                                PMGuards.isInitialClaimRound,
                                PMGuards.isLastPlayerInSequence),
                            target: PMState.place,
                            actions: [
                                PMAction.updateClaimedDomino,
                                PMAction.updatePlayerOrderForNewRound,
                                PMAction.updateCurrentPlayer                            
                            ]                                
                        },
                        {
                            cond: guards.every(
                                PMGuards.isEventPlayersTurn,
                                PMGuards.isEventDominoAvailable),
                            target: PMState.claim,
                            actions: [
                                PMAction.updateClaimedDomino,
                                PMAction.updatePlayerSequence,
                                PMAction.updateCurrentPlayer,
                                PMAction.updateInitialClaimRound
                            ]

                        },
                    ],
                }
            },
            [PMState.place]: {
                on: {
                    [PMEvent.playerPlacesDomino]: [
                    {
                        cond: guards.every(
                            PMGuards.isEventPlayersTurn,
                            PMGuards.isEventDominoCurrentDomino,
                            PMGuards.isLastClaimedDomino
                        ),
                        target: PMState.claim,
                        actions:[]
                    }
                ],
            },
            [PMState.gameOver]: {}
        }
    },
        {
            actions: {
                [PMAction.updateClaimedDomino]: (context, event:DominoEvent) => {
                    const newDominos = calcDominoClaim(context.dominos, event.player, event.dominoId);
                    assign({dominos: newDominos} as PMContext);
                },
                [PMAction.updateCurrentPlayer]: (context, event) => {
                    assign({ 
                        currentPlayer: context.playerTurnOrder[0] 
                    } as PMContext);
                },
                [PMAction.updatePlayerSequence]: (context, event) => {
                    // remove current player from the turn order
                    const newPlayerTurnOrder = [...context.playerTurnOrder];
                    newPlayerTurnOrder.shift(); 
                    assign({
                        playerTurnOrder: newPlayerTurnOrder
                    } as PMContext);
                },
                [PMAction.updatePlayerOrderForNewRound]: (context, event) => {
                    assign({
                        playerTurnOrder: calcPlayerTurnOrder(context.dominos)
                    } as PMContext);
                },
                [PMAction.updateInitialClaimRound]: (context, event) =>{
                    assign({isInitialClaimRound: false} as PMContext);
                },
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
                    return context.playerTurnOrder.length === 1 &&
                        context.playerTurnOrder[0] === dominoEvent.player;
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

function calcDominoClaim(dominos:Domino[], playerName:string, dominoId:number) {
    // update the domino to indicate that he claimed it
    const newDominos = [...dominos];
    findDomino(newDominos, dominoId)!.pickedBy = playerName;
    return newDominos;
}

function calcPlayerTurnOrder(dominos: Domino[]): string[] {
    const claimed = getDominosByState(dominos, DominoState.InPickList_Claimed);
    claimed.sort((a, b) => {
        if (a.rank === b.rank) return 0;
        return a.rank > b.rank ? -1 : 1;
    });
    return claimed.map(d => d.pickedBy!);
}

export function getPMContext(playerManager: PlayerManagerType) { return playerManager.machine.context };

export interface IPlayerManager {
    execute(event: DominoEvent): void;
}
