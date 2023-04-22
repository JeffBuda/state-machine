import { DominoState, dominosOfState } from '../src/domino';
import { PMEvent, PMState, createPlayerManager } from '../src/playerManager';

describe('PlayerManager', () => {
    it('can start', () => {
        const pm = createPlayerManager();
        expect(pm.getSnapshot().context).toBeTruthy();
    });
    it('does not allow the wrong player to claim', () => {
        const pm = createPlayerManager();
        var current = pm.getSnapshot();
        expect(current.value).toBe(PMState.claim);
        expect(current.context.currentPlayer).toBe('jeff');

        const dominos = dominosOfState(current.context.dominos, DominoState.InPickList_Available);
        pm.send({ type: PMEvent.playerClaimsDomino, player: 'dave', dominoId: dominos[0].rank });

        current = pm.getSnapshot();
        expect(current.value).toBe(PMState.claim);
        expect(current.context.currentPlayer).toBe('jeff');
    });
    it('does allow the correct player to claim', () => {
        const pm = createPlayerManager();
        pm.onTransition(x => x.changed);
        var current = pm.getSnapshot();
        expect(current.value).toBe(PMState.claim);
        expect(current.context.currentPlayer).toBe('jeff');

        var dominos = dominosOfState(current.context.dominos, DominoState.InPickList_Available);
        pm.send({ type: PMEvent.playerClaimsDomino, player: 'jeff', dominoId: dominos[0].rank });

        dominos = dominosOfState(current.context.dominos, DominoState.InPickList_Available);
        pm.send({ type: PMEvent.playerClaimsDomino, player: 'dave', dominoId: dominos[0].rank });

        current = pm.getSnapshot();
        expect(current.value).toBe(PMState.place);
    });

});