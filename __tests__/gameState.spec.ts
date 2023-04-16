import { DominoState, dominosOfState } from '../src/domino';
import { GameState, GameStateAction, executeGameAction } from '../src/gameState';

describe('GameStateAction.Initialize', () => {
    it('should property configure all dominos', () => {
        const gameState = executeGameAction(GameStateAction.Initialize, { player1: '1', player2: '2' });
        expect(dominosOfState(gameState.dominos, DominoState.OutOfGame).length).toBe(24);
        expect(dominosOfState(gameState.dominos, DominoState.InDrawPile).length).toBe(24 - 4);
        expect(dominosOfState(gameState.dominos, DominoState.InPickList_Available).length).toBe(4);
        expect(gameState.state).toBe(GameState.Pick1_Player1);
    })
});

describe('GameStateAction.Pick1_Player2', () => {
    it('should property configure all dominos', () => {

        let gameData = executeGameAction(GameStateAction.Initialize, { player1: '1', player2: '2' });
        
        gameData = executeGameAction(GameStateAction.Pick_Player1,
            {
                //pick the first domino in the pick list
                dominoRank: dominosOfState(gameData.dominos, DominoState.InPickList_Available)[0].rank,
            },
            gameData);

            expect(gameData.state).toBe(GameState.Pick1_Player2);
        })
});
