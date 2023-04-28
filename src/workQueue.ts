import { update } from "xstate/lib/actionTypes";
import { IDomino, DominoState, calcDominoClaimed, calcDominoPlaced, getDominosByState, initializeDominos } from "./domino";

export enum PlayKind {
    ClaimDomino = "ClaimDomino",
    PlaceDomino = "PlaceDomino",
    Pass = "Pass",
    CalculateNextRound = "CalculateNextRound"
}

export interface IStep {
    playerName?: string;
    readonly playKind: PlayKind;
    dominoId?: number;
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
    readonly dominos: IDomino[];
    readonly steps: IStep[];
}

export function generateState(playerNames: string[]): IState {

    if (playerNames.length !== 2) throw new Error();

    const steps: IStep[] = [
        { playerName: playerNames[0], playKind: PlayKind.ClaimDomino, dominoId: undefined },
        { playerName: playerNames[1], playKind: PlayKind.ClaimDomino, dominoId: undefined },
        { playerName: playerNames[0], playKind: PlayKind.ClaimDomino, dominoId: undefined },
        { playerName: playerNames[1], playKind: PlayKind.ClaimDomino, dominoId: undefined },
        { playerName: undefined, playKind: PlayKind.CalculateNextRound, dominoId: undefined }
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
        if (!getDominosByState(state.dominos, DominoState.InPickList_Available).find(d => d.rank === command.dominoId)) {
            return { command, state, success: false, message: 'Domino not available' };
        }
        updatedState.dominos = calcDominoClaimed(updatedState.dominos, command.playerName, command.dominoId);

        calcPlayerOrderForNextRound(updatedState);

    } else if (currentStep.playKind === PlayKind.PlaceDomino) {

        if (command.playerName !== currentStep.playerName ||
            command.playKind !== currentStep.playKind ||
            command.dominoId !== currentStep.dominoId) {
            return { command, state, success: false, message: 'Invalid Player, Play, or Domino.' };
        }

        // mark step as complete
        updatedState.steps.shift();

        // mark domino as placed
        updatedState.dominos = calcDominoPlaced(updatedState.dominos, command.playerName, command.dominoId);

        calcPlayerOrderForNextRound(updatedState);
    }

    return { success: true, command: command, state: updatedState, message: 'Success' };
}

function calcPlayerOrderForNextRound(updatedState: { dominos: IDomino[]; steps: IStep[]; }) {
    if (updatedState.steps[0].playKind === PlayKind.CalculateNextRound) {
        // mark calc step as complete
        updatedState.steps.shift();

        // set player order for next round
        const claimedDominos = getSortedClaimedDominos(updatedState.dominos);
        for (let i = 0; i < 4; i++) {
            updatedState.steps[i].playerName = claimedDominos[i].pickedBy;
            updatedState.steps[i].dominoId = claimedDominos[i].rank;
        }
    }
}

function getSortedClaimedDominos(dominos: IDomino[]): IDomino[] {
    const claimed = getDominosByState(dominos, DominoState.InPickList_Claimed);
    claimed.sort((a, b) => {
        if (a.rank === b.rank) return 0;
        return a.rank > b.rank ? 1 : -1;
    });
    return claimed;
}