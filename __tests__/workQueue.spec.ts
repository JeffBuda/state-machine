import { DominoState, getDominosByState } from '../src/domino';
import { PlayKind, generateState, processCommand } from '../src/workQueue';

describe('work queue', () => {
    it('has some items', () => {
        var state = generateState(['jeff', 'dave']);
        expect(state.steps.length).toBeGreaterThan(1);
    });
    describe('executeCommand', () => {
        it('rejects invalid commands', () => {
            var state = generateState(['jeff', 'dave']);
            const result = processCommand(state, { playerName: 'dave', playKind: PlayKind.ClaimDomino, dominoId: 0 });
            expect(result.success).toBeFalsy();
        });
        it('accepts valid commands', () => {
            var state = generateState(['jeff', 'dave']);
            const domino = getDominosByState(state.dominos, DominoState.InPickList_Available);
            const result = processCommand(state, { playerName: 'jeff', playKind: PlayKind.ClaimDomino, dominoId: domino[0].rank });
            expect(result.success).toBeTruthy();
            expect(getDominosByState(result.state.dominos, DominoState.InPickList_Claimed).length).toBe(1);
        });
        it('can calculate the correct player sequence for the first round', () => {
            var state = generateState(['jeff', 'dave']);

            var domino = getDominosByState(state.dominos, DominoState.InPickList_Available);
            var result = processCommand(state, { playerName: 'jeff', playKind: PlayKind.ClaimDomino, dominoId: domino[0].rank });
            
            domino = getDominosByState(state.dominos, DominoState.InPickList_Available);
            result = processCommand(state, { playerName: 'dave', playKind: PlayKind.ClaimDomino, dominoId: domino[0].rank });
            
            domino = getDominosByState(state.dominos, DominoState.InPickList_Available);
            result = processCommand(state, { playerName: 'jeff', playKind: PlayKind.ClaimDomino, dominoId: domino[0].rank });
            
            domino = getDominosByState(state.dominos, DominoState.InPickList_Available);
            result = processCommand(state, { playerName: 'dave', playKind: PlayKind.ClaimDomino, dominoId: domino[0].rank });

            expect(getDominosByState(result.state.dominos, DominoState.InPickList_Claimed).length).toBe(4);
            expect(getDominosByState(result.state.dominos, DominoState.InPickList_Available).length).toBe(0);

            // place the first domino
        });
    });
});