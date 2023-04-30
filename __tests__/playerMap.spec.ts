import exp from 'constants';
import { findDomino, getDominos } from '../src/domino';
import { kingdomToString, getNewKingdom, getAt, getValidLocations, isValidLocation, placeDomino, kingdomToJavaScript } from '../src/playerMap';
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
    it('can place a Domino next to Castle', () => {
        const k = getNewKingdom();
        const d = getDominos();
        const locA = { x: -2, y: 0 };
        const locB = { x: -1, y: 0 };
        let u = placeDomino(k, d[0], { locA, locB });
        expect(getAt(u, locA)).toBeTruthy();
        expect(getAt(u, locB)).toBeTruthy();
    });
    it('can print a Kingdom as JavaScript', () => {
        const k = getNewKingdom();
        const d = getDominos();
        const locA = { x: -2, y: 0 };
        const locB = { x: -1, y: 0 };
        let u = placeDomino(k, d[0], { locA, locB });
        const js = kingdomToJavaScript(k);
        expect(js).toBeTruthy();
    });

    describe('handles specific scenarios', () => {
        it('ensures the Kingdom is not wider than 5 tiles', () => {
            var k = getNewKingdom();
            const d = getDominos();
            const locA = { x: -2, y: 0 };
            const locB = { x: -1, y: 0 };
            k = placeDomino(k, findDomino(d, 7)!, { locA, locB });
            k = placeDomino(k, findDomino(d, 7)!, { locA: { x: -3, y: 0 }, locB: { x: -4, y: 0 } });
            k = placeDomino(k, findDomino(d, 7)!, { locA: { x: 1, y: 0 }, locB: { x: 2, y: 0 } });
            expect(k).toBeTruthy();
        });
    });
});
