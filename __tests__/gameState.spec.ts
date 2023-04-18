import { DominoState, dominosOfState } from '../src/domino';
import { GameState, GameStateAction, executeGameAction } from '../src/gameState';

describe('GameStateAction.Initialize', () => {
    it('should property configure all dominos', () => {
        const gameData = executeGameAction(GameStateAction.Initialize, { player1: '1', player2: '2' });
        expect(dominosOfState(gameData.dominos, DominoState.OutOfGame).length).toBe(24);
        expect(dominosOfState(gameData.dominos, DominoState.InDrawPile).length).toBe(24 - 4);
        expect(dominosOfState(gameData.dominos, DominoState.InPickList_Available).length).toBe(4);
        expect(gameData.state).toBe(GameState.Claim1_Player1);
    })
});

describe('GameStateAction.Claim_Player1', () => {
    it('should property configure all dominos', () => {

        let gameData = executeGameAction(GameStateAction.Initialize, { player1: '1', player2: '2' });

        gameData = executeGameAction(GameStateAction.Claim_Player1,
            {
                //pick the first domino in the pick list
                dominoRank: dominosOfState(gameData.dominos, DominoState.InPickList_Available)[0].rank,
            },
            gameData);

        expect(gameData.state).toBe(GameState.Claim1_Player2);
        expect(dominosOfState(gameData.dominos, DominoState.InPickList_Claimed).length).toBe(1);
        expect(dominosOfState(gameData.dominos, DominoState.InPickList_Available).length).toBe(3);
        expect(dominosOfState(gameData.dominos, DominoState.InDrawPile).length).toBe(24-4);
        expect(dominosOfState(gameData.dominos, DominoState.OutOfGame).length).toBe(24);
    })
});
