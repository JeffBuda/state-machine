import * as repl from 'repl';
import { DominoState, getDominos, getDominosByState, sortByRank, dominoToString, findDomino } from './domino';
import { getNewKingdom, getValidLocations, isValidLocation, kingdomToJSON, kingdomToString, locationsToString, placeDomino } from './playerMap';


const prompt = '> ';

const replServer = repl.start({ prompt });

replServer.context.kingdom = getNewKingdom();
replServer.context.dominos = getDominos();

replServer.defineCommand('gamePrint',{
    help: 'Prints the Kingdom',
    action(text) {
        console.log(kingdomToString(replServer.context.kingdom));
        this.displayPrompt();
    }
});

replServer.defineCommand('gamePrintJson',{
    help: 'Prints the Kingdom as JSON',
    action(text) {
        console.log(kingdomToJSON(replServer.context.kingdom));
        this.displayPrompt();
    }
});

replServer.defineCommand('gamePrintDomino',{
    help: 'Prints the Domino',
    action(text) {
        const args = text.split(' ');
        const rank = parseInt(args[0]);
        console.log(dominoToString(findDomino(replServer.context.dominos, rank)!));
        this.displayPrompt();
    }
});

replServer.defineCommand('gameValidLocations',{
    help: 'Prints the valid locations (rank)',
    action(text) {
        const args = text.split(' ');
        const rank = parseInt(args[0]);
        const k = replServer.context.kingdom;
        const d = findDomino(replServer.context.dominos, rank)!;
        const locs = getValidLocations(k,d);
        
        console.log(locationsToString(locs.vertical));
        console.log(locationsToString(locs.horizontal));
        console.log(dominoToString(d));
        
        this.displayPrompt();
    }
});


replServer.defineCommand('gamePlace', {
    help: 'Place a Domino (rank, x1, y1, x2, y2)',
    action(text) {
        const k = replServer.context.kingdom;
        const dominos = replServer.context.dominos;
        const args = text.split(' ');
        const rank = parseInt(args[0]);
        const x1 = parseInt(args[1]);
        const y1 = parseInt(args[2]);
        const x2 = parseInt(args[3]);
        const y2 = parseInt(args[4]);
        const dLoc = { locA: { x: x1, y: y1 }, locB: { x: x2, y: y2 } };
        const d = findDomino(dominos, rank)!;

        if (!isValidLocation(replServer.context.kingdom, d, dLoc)) {
            console.log('Invalid location.');
        } else {
            replServer.context.kingdom = placeDomino(k, d, dLoc);
            console.log(kingdomToString(replServer.context.kingdom));
        }

        this.displayPrompt();
    }
});


replServer.defineCommand('gameListDominoStates', {
    help: 'Shows all domino states',
    action(text) {
        for (const ds in DominoState)
            console.log(ds);
        this.displayPrompt();
    }
});

// replServer.defineCommand('gameListDominos', {
//     help: 'Shows all dominos of a given state',
//     action(text) {
//         const dominos = getDominosByState((getPMContext(pm(replServer))).dominos, text as DominoState);
//         dominos.sort(sortByRank).forEach(d => console.log(d.toString()));
//         this.displayPrompt();
//     }
// });

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

