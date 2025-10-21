import { Colors } from '../../constants/Colors';

const player1InitialState = { id: 1, position: 0, color: Colors.red, name: 'Player 1', hasStarted: false };
const player2InitialState = { id: 2, position: 0, color: Colors.green, name: 'Player 2', hasStarted: false };
const player3InitialState = { id: 3, position: 0, color: Colors.yellow, name: 'Player 3', hasStarted: false };
const player4InitialState = { id: 4, position: 0, color: Colors.blue, name: 'Player 4', hasStarted: false };

export const snakeLadderInitialState = {
  player1: player1InitialState,
  player2: player2InitialState,
  player3: player3InitialState,
  player4: player4InitialState,
  chancePlayer: 1,
  diceNo: 1,
  isDiceRolled: false,
  winner: null,
  fireworks: false,
  touchDiceBlock: false,
  pileSelectionPlayer: -1, // For showing dashed circle animation
  
  // Snake and Ladder positions on a 10x10 board (1-100)
  snakes: [
    { head: 98, tail: 79 },
    { head: 95, tail: 76 },
    { head: 91, tail: 72 },
    { head: 75, tail: 24 },
    { head: 64, tail: 57 },
    { head: 62, tail: 21 },
    { head: 52, tail: 48 },
    { head: 31, tail: 8 }
  ],
  
  ladders: [
    { bottom: 3, top: 22 },
    { bottom: 15, top: 47 },
    { bottom: 77, top: 96 },
    { bottom: 22, top: 43 },
    { bottom: 33, top: 51 },
    { bottom: 87, top: 93 },
    { bottom: 67, top: 73 },
    { bottom: 17, top: 36 },
    // { bottom: 80, top: 83 }
  ]
};
