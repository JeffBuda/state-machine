import exp from 'constants';
import { findDomino, getDominos } from '../src/domino';
import { kingdomToString, getNewKingdom, getAt, getValidLocations, isValidLocation, placeDomino, kingdomToJavaScript, kingdomWouldBeValidSize, getTileCountForX, getTileCountForY, dominoLocationsEqual } from '../src/playerMap';
import { IDominoLocation, TileKind } from '../src/tile';

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
            expect(getTileCountForX(k, 0)).toBe(1);
            expect(getTileCountForY(k, 0)).toBe(1);

            const d = getDominos();
            const locA = { x: -2, y: 0 };
            const locB = { x: -1, y: 0 };

            k = placeDomino(k, findDomino(d, 7)!, { locA, locB });
            expect(getTileCountForY(k, 0)).toBe(3);

            expect(
                getValidLocations(k, findDomino(d, 7)!).horizontal.find(
                    dl => dominoLocationsEqual(dl, { locA: { x: -3, y: 0 }, locB: { x: -4, y: 0 } })))
                    .toBeTruthy();
            k = placeDomino(k, findDomino(d, 7)!, { locA: { x: -3, y: 0 }, locB: { x: -4, y: 0 } });

            expect(getTileCountForY(k, 0)).toBe(5);

            const result = kingdomWouldBeValidSize(k, { locA: { x: 1, y: 0 }, locB: { x: 2, y: 0 } });
            expect(result).toBeFalsy();
            //            k = placeDomino(k, findDomino(d, 7)!, { locA: { x: 1, y: 0 }, locB: { x: 2, y: 0 } });
        });
    });

    describe('ITIleLocation', () => {
        describe('locationsEqual', () => {
            it('can determine if two locations are effectively equal', () => {
                const a: IDominoLocation = { locA: { x: 1, y: 2 }, locB: { x: 3, y: 4 } };
                const b: IDominoLocation = { locA: { x: 3, y: 4 }, locB: { x: 1, y: 2 } };
                expect(dominoLocationsEqual(a, b)).toBeTruthy();
                expect(dominoLocationsEqual(b, a)).toBeTruthy();
            });
        });
    });
});
