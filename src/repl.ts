import * as repl from 'repl';
import { DominoState, getDominosByState, sortByRank } from './domino';
import { IPlayerManager, PMContext, PMEvent, PlayerManagerType, createPlayerManager, getPMContext } from './playerManager';


const prompt = '> ';

const replServer = repl.start({ prompt });
const pm = (rs:repl.REPLServer):PlayerManagerType => rs.context.playerManager;
replServer.context.playerManager = createPlayerManager(); 
pm(replServer).onTransition((state, event)=>{
    console.log(state);
    console.log(event);
    // console.log(`Transition: ${event.type} ${event}`);
    // if (event.error) {
    //     console.log(`Transition failed with error: ${event.error}`);
    //   } else {
    //     console.log(`Transition was successful`);
    //   }
});

replServer.defineCommand('gameClaim', {
    help: 'Claim a Domino for a Player (playerName dominoId)',
    action(text) {
        const player = text.split(' ')[0];
        const domino = parseInt(text.split(' ')[1]);
        pm(replServer).send({type: PMEvent.playerClaimsDomino, player: player, dominoId: domino});
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
        const dominos = getDominosByState((getPMContext(pm(replServer))).dominos, text as DominoState);
        dominos.sort(sortByRank).forEach(d => console.log(d.toString()));
        this.displayPrompt();
    }
});

// replServer.defineCommand('gameListPicks', {
//     help: 'List Pick List',
//     action() {
//         let dominos = dominosOfState((replServer.context.gameData as IGameData).dominos, DominoState.InPickList_Available);
//         dominos.sort(sortByRank).forEach(d => console.log(d.toString()));

//         dominos = dominosOfState((replServer.context.gameData as IGameData).dominos, DominoState.InPickList_Claimed);
//         dominos.sort(sortByRank).forEach(d => console.log(d.toString()));

//         this.displayPrompt();
//     }
// });

// replServer.defineCommand('gameClaim', {
//     help: 'Claim a Domino for a Player',
//     action(text) {

//         const playerNumber = text.split(' ')[0];
//         const dominoRank = text.split(' ')[1];

//         replServer.context.gameData = executeGameAction(
//             GameStateAction.Claim_Player1,
//             {player: playerNumber, dominoId: parseInt(dominoRank)},
//             replServer.context.gameData as IGameData);
        
//             const dominos = dominosOfState((replServer.context.gameData as IGameData).dominos, text as DominoState);
//         dominos.sort(sortByRank).forEach(d => console.log(d.toString()));
//         this.displayPrompt();
//     }
// });


replServer.defineCommand('exit', {
  help: 'Exit the REPL',
  action() {
    process.exit(0);
  },
});

