import { getDominos } from '../src/domino';
import { getNewKingdom, getValidLocations } from '../src/playerMap';
import { TileKind } from '../src/tile';

describe('PlayerMap', () => {
    it('calculates the available positions around the Castle', () => {
        const k = getNewKingdom();
        const d = getDominos();
        const validLocations = getValidLocations(k, d[0]);
        expect(validLocations.horizontal.length).toBeGreaterThan(0);
        expect(validLocations.vertical.length).toBeGreaterThan(0);
    });
});