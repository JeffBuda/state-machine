import { DominoState, dominosOfState } from '../src/domino';
import { GameState, GameStateAction, executeGameAction } from '../src/gameState';

describe('GameStateAction.Initialize', () => {
  it('should property configure all dominos', () => {
    const gameState = executeGameAction(GameStateAction.Initialize, {player1:'1', player2:'2'});
    expect(dominosOfState(gameState.dominos, DominoState.OutOfGame).length).toBe(24);
    expect(dominosOfState(gameState.dominos, DominoState.InDrawPile).length).toBe(24-4);
    expect(dominosOfState(gameState.dominos, DominoState.InPickList_Available).length).toBe(4);
})});