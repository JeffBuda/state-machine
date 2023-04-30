import { getDominos } from '../src/domino';
import { getNewKingdom, getValidLocations, isValidLocation } from '../src/playerMap';
import { TileKind } from '../src/tile';

describe('PlayerMap', () => {
    it('calculates the available positions around the Castle', () => {
        const k = getNewKingdom();
        const d = getDominos();
        const validLocations = getValidLocations(k, d[0]);
        expect(validLocations.horizontal.length).toBeGreaterThan(0);
        expect(validLocations.vertical.length).toBeGreaterThan(0);
    });
    it('determines if a location is valid', () => {
        const k = getNewKingdom();
        const d = getDominos();
        expect(isValidLocation(k, d[0], { locA: { x: 0, y: 1 }, locB: { x: 0, y: 2 } })).toBeTruthy();
        expect(isValidLocation(k, d[0], { locA: { x: 2, y: 3 }, locB: { x: 2, y: 4 } })).toBeFalsy();
    });
});