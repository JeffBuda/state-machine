import * as repl from 'repl';
import { GameState, GameStateAction, IGameData, executeGameAction } from './gameState';
import { DominoState, dominosOfState, sortByRank } from './domino';

const prompt = '> ';

const replServer = repl.start({ prompt });

replServer.defineCommand('gameInit', {
    help: 'Start new Domino game',
    action(text) {
        const p1 = text.split(' ')[0];
        const p2 = text.split(' ')[1];
        replServer.context.gameState = executeGameAction(GameStateAction.Initialize, {player1:p1, player2: p2});
        console.log(`Started game for ${replServer.context.gameState.player1} and ${replServer.context.gameState.player2}`);
        this.displayPrompt();
    }
});

replServer.defineCommand('gameListDominoStates', {
    help: 'Shows all domino states',
    action(text) {
        for(const ds in DominoState)
            console.log(ds);
        this.displayPrompt();
    }
});


replServer.defineCommand('gameListDominos', {
    help: 'Shows all dominos of a given state',
    action(text) {
        const dominos = dominosOfState((replServer.context.gameState as IGameData).dominos, text as DominoState);
        dominos.sort(sortByRank).forEach(d => console.log(d.toString()));
        this.displayPrompt();
    }
});

replServer.defineCommand('exit', {
  help: 'Exit the REPL',
  action() {
    process.exit(0);
  },
});

