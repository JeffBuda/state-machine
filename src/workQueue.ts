import { update } from "xstate/lib/actionTypes";
import { Domino, DominoState, calcDominoClaimed, calcDominoPlaced, getDominosByState, initializeDominos } from "./domino";

export enum PlayKind {
    ClaimDomino = "ClaimDomino",
    PlaceDomino = "PlaceDomino",
    Pass = "Pass",
    CalculateNextRound = "CalculateNextRound"
}

export interface IStep {
    playerName?: string;
    readonly playKind: PlayKind;
}

export interface ICommand {
    readonly playerName: string;
    readonly playKind: PlayKind;
    readonly dominoId: number;
}

export interface ICommandResult {
    readonly command: ICommand;
    readonly success: boolean;
    readonly state: IState;
    readonly message: string;
}

export interface IState {
    readonly dominos: Domino[];
    readonly steps: IStep[];
}

export function generateState(playerNames: string[]): IState {

    if (playerNames.length !== 2) throw new Error();

    const steps = [
        { playerName: playerNames[0], playKind: PlayKind.ClaimDomino },
        { playerName: playerNames[1], playKind: PlayKind.ClaimDomino },
        { playerName: playerNames[0], playKind: PlayKind.ClaimDomino },
        { playerName: playerNames[1], playKind: PlayKind.ClaimDomino },
        { playerName: undefined, playKind: PlayKind.CalculateNextRound }
    ];

    for (var i = 0; i < 10; i++) {
        const roundSteps = [
                { playerName: undefined, playKind: PlayKind.PlaceDomino },
                { playerName: undefined, playKind: PlayKind.ClaimDomino },
                { playerName: undefined, playKind: PlayKind.PlaceDomino },
                { playerName: undefined, playKind: PlayKind.ClaimDomino },
                { playerName: undefined, playKind: PlayKind.CalculateNextRound }
            ];
        steps.push(...roundSteps);
    }

    return { dominos: initializeDominos(), steps };
}

export function processCommand(state: IState, command: ICommand): ICommandResult {
    const currentStep = state.steps[0];

    if (command.playKind !== currentStep.playKind ||
        command.playerName !== currentStep.playerName) {
        return { success: false, command: command, state: state, message: 'Invalid Play or Player' };
    }

    const updatedState = {
        ...state,
        dominos: [...state.dominos]
    };

    if (currentStep.playKind === PlayKind.ClaimDomino) {

        // mark step as complete
        updatedState.steps.shift();

        // mark domino as claimed
        if(!getDominosByState(state.dominos, DominoState.InPickList_Available).find(d => d.rank === command.dominoId)) {
            return {command, state, success: false, message: 'Domino not available'};
        }
        updatedState.dominos = calcDominoClaimed(updatedState.dominos, command.playerName, command.dominoId);

        if (updatedState.steps[0].playKind === PlayKind.CalculateNextRound) {
            // mark calc step as complete
            updatedState.steps.shift();

            // set player order for next round
            const order = calcPlayerTurnOrder(updatedState.dominos);
            for (let i = 0; i < 4; i++) {
                updatedState.steps[i].playerName = order[i];
            }
        }

    } else if (currentStep.playKind === PlayKind.PlaceDomino) {

        // mark step as complete
        updatedState.steps.shift();

        // mark domino as placed
        updatedState.dominos = calcDominoPlaced(updatedState.dominos, command.playerName, command.dominoId);
    }

    return { success: true, command: command, state: updatedState, message: 'Success' };
}

function calcPlayerTurnOrder(dominos: Domino[]): string[] {
    const claimed = getDominosByState(dominos, DominoState.InPickList_Claimed);
    claimed.sort((a, b) => {
        if (a.rank === b.rank) return 0;
        return a.rank > b.rank ? -1 : 1;
    });
    return claimed.map(d => d.pickedBy!);
}