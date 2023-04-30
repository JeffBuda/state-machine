import { getDominos } from '../src/domino';
import { getNewKingdom, getAt, getValidLocations, isValidLocation, placeDomino } from '../src/playerMap';
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
    it('can place a Domino next to Castle', () =>{
        const k = getNewKingdom();
        const d = getDominos();
        const locA = {x:-2, y:0};
        const locB = {x:-1, y:0};
        let u = placeDomino(k, d[0], {locA, locB});
        expect(getAt(u, locA)).toBeTruthy();
        expect(getAt(u, locB)).toBeTruthy();
    });
});