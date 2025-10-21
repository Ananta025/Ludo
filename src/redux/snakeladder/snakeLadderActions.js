import { playSound } from "../../helpers/SoundUtility";
import { updatePlayerPosition, updatePlayerChance, announceWinner, updateFireworks, unfreezeDice, disableTouch } from "./snakeLadderSlice";
import { 
  selectSnakeLadderPlayer1,
  selectSnakeLadderPlayer2,
  selectSnakeLadderPlayer3,
  selectSnakeLadderPlayer4,
  selectSnakeLadderSnakes, 
  selectSnakeLadderLadders 
} from "./snakeLadderSelectors";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function checkWiningCriteria(player) {
  return player.position >= 100;
}

export const handleSnakeLadderMoveThunk = (playerNo, diceNo) => async (dispatch, getState) => {
  const state = getState();
  const snakes = selectSnakeLadderSnakes(state);
  const ladders = selectSnakeLadderLadders(state);
  
  let currentPlayer;
  switch(playerNo) {
    case 1:
      currentPlayer = selectSnakeLadderPlayer1(state);
      break;
    case 2:
      currentPlayer = selectSnakeLadderPlayer2(state);
      break;
    case 3:
      currentPlayer = selectSnakeLadderPlayer3(state);
      break;
    case 4:
      currentPlayer = selectSnakeLadderPlayer4(state);
      break;
    default:
      return;
  }

  dispatch(disableTouch());

  // Check if player hasn't started yet
  if (!currentPlayer.hasStarted) {
    if (diceNo === 1) {
      // Player can start with a 1
      playSound('pile_move');
      dispatch(updatePlayerPosition({ playerNo, newPosition: 1 }));
      await delay(300); // Match Ludo animation timing
      
      // Give another turn for rolling 1 to start
      dispatch(updatePlayerChance({ chancePlayer: playerNo }));
      dispatch(unfreezeDice());
    } else {
      // Player needs to roll 1 to start
      playSound('ui');
      await delay(300);
      let nextPlayer = playerNo + 1;
      if (nextPlayer > 4) nextPlayer = 1;
      dispatch(updatePlayerChance({ chancePlayer: nextPlayer }));
      dispatch(unfreezeDice());
    }
    return;
  }

  // Player has already started - normal movement
  // Check if move goes beyond 100 - bounce back rule (optional)
  if (currentPlayer.position + diceNo > 100) {
    // Player needs exact roll to win, pass turn
    playSound('ui');
    await delay(300);
    let nextPlayer = playerNo + 1;
    if (nextPlayer > 4) nextPlayer = 1;
    dispatch(updatePlayerChance({ chancePlayer: nextPlayer }));
    dispatch(unfreezeDice());
    return;
  }
  
  // Step-by-step movement animation like Ludo
  let currentPosition = currentPlayer.position;
  for (let i = 0; i < diceNo; i++) {
    currentPosition += 1;
    dispatch(updatePlayerPosition({ playerNo, newPosition: currentPosition }));
    playSound('pile_move');
    await delay(300); // Same timing as Ludo
  }
  
  let newPosition = currentPosition;
  
  // Check for snake
  const snake = snakes.find(s => s.head === newPosition);
  if (snake) {
    playSound('collide');
    await delay(300);
    newPosition = snake.tail;
    dispatch(updatePlayerPosition({ playerNo, newPosition }));
    await delay(300);
  }
  
  // Check for ladder
  const ladder = ladders.find(l => l.bottom === newPosition);
  if (ladder) {
    playSound('safe_spot');
    await delay(300);
    newPosition = ladder.top;
    dispatch(updatePlayerPosition({ playerNo, newPosition }));
    await delay(300);
  }
  
  // Check for winner
  const finalState = getState();
  let updatedPlayer;
  switch(playerNo) {
    case 1:
      updatedPlayer = selectSnakeLadderPlayer1(finalState);
      break;
    case 2:
      updatedPlayer = selectSnakeLadderPlayer2(finalState);
      break;
    case 3:
      updatedPlayer = selectSnakeLadderPlayer3(finalState);
      break;
    case 4:
      updatedPlayer = selectSnakeLadderPlayer4(finalState);
      break;
  }
  
  if (checkWiningCriteria(updatedPlayer)) {
    dispatch(announceWinner(playerNo));
    playSound('cheer', true);
    playSound('home_win');
    dispatch(updateFireworks(true));
    
    setTimeout(() => {
      dispatch(updateFireworks(false));
    }, 5000);
    
    return;
  }

  // Next player's turn (no extra turn for 6 in Snake & Ladder)
  let next = playerNo + 1;
  if (next > 4) next = 1;
  dispatch(updatePlayerChance({ chancePlayer: next }));

  await delay(300);
  dispatch(unfreezeDice());
};

// Snake & Ladder uses automatic movement - no manual pile selection needed
// Each player has only one piece that moves automatically when dice is rolled
