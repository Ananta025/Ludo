import { SafeSpots, StarSpots, turningPoints, victoryStart } from "../../helpers/PlotData";
import { playSound } from "../../helpers/SoundUtility";
import { selectCurrentPositions, selectDiceNo } from "./ludoSelectors";
import { announceWinner, disableTouch, unfreezeDice, updateFireworks, updatePlayerChance, updatePlayerPieceValue } from "./ludoSlice";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


function checkWiningCriteria(pieces){
    for(let piece of pieces){
        if(piece.travelCount < 57){
            return false
        }
    }
    return true
}

export const handleForwardThunk = (playerNo, id, pos) => async (dispatch, getState) => {
  const state = getState();
  const plottedPieces = selectCurrentPositions(state);
  const diceNo = selectDiceNo(state);

  const piecesAtPosition = plottedPieces.filter(item => item.pos === pos);
  const alpha = ['A', 'B', 'C', 'D'][playerNo - 1];
  const piece = piecesAtPosition.find(item => item.id.startsWith(alpha));

  dispatch(disableTouch());

  const beforePlayerPiece = state.game[`player${playerNo}`].find(item => item.id === id);
  let { pos: finalPath, travelCount } = beforePlayerPiece;

  // Guard for exceeding 57
  if (travelCount + diceNo > 57) {
    dispatch(unfreezeDice());
    return;
  }

  const playerTurnPoint = turningPoints[playerNo - 1];
  const playerVictoryStart = victoryStart[playerNo - 1];

  for (let i = 0; i < diceNo; i++) {
    const updatedState = getState();
    const playerPiece = updatedState.game[`player${playerNo}`].find(item => item.id === id);
    let currentPos = playerPiece.pos;
    let path = currentPos + 1;

    // Determine if piece is entering or already in victory lane based on travelCount
    if (travelCount >= 51) {
      const victoryLaneStep = travelCount - 51;
      path = playerVictoryStart + victoryLaneStep;
    } else {
      // Check if piece will enter victory lane on this step
      if (travelCount + 1 === 51 && currentPos === playerTurnPoint) {
        // About to enter victory lane
        path = playerVictoryStart;
      } else {
        // Normal board movement with wrapping
        if (path > 52) {
          path = path - 52; // Wrap around the board
        }
        // Double-check turning point logic for edge cases
        if (travelCount + 1 >= 51 && path === playerTurnPoint) {
          path = playerVictoryStart;
        }
      }
    }

    finalPath = path;
    travelCount += 1;

    dispatch(updatePlayerPieceValue({
      playerNo: `player${playerNo}`,
      pieceId: playerPiece.id,
      pos: path,
      travelCount
    }));
    playSound('pile_move');
    await delay(300);
  }

  const updatedState = getState();
  const updatedPlottedPieces = selectCurrentPositions(updatedState);
  const finalPlot = updatedPlottedPieces.filter(item => item.pos === finalPath);

  const ids = finalPlot.map(i => i.id[0]);
  const uniqueIds = new Set(ids);
  const areDifferentIds = uniqueIds.size > 1;

  // Use travelCount (51+ means entered victory path) as primary indicator
  const isInVictoryLaneAtEnd = travelCount >= 51;

  if (SafeSpots.includes(finalPath) || StarSpots.includes(finalPath)) playSound('safe_spot');

  // Handle collisions only if not in victory lane, not on safe spots, and different players
  if (areDifferentIds && !SafeSpots.includes(finalPath) && !StarSpots.includes(finalPath) && !isInVictoryLaneAtEnd) {
    const enemyPiece = finalPlot.find(i => i.id[0] !== id[0]);
    const enemyAlpha = enemyPiece.id[0];
    const enemyNo = ['A', 'B', 'C', 'D'].indexOf(enemyAlpha) + 1;

    playSound('collide');
    dispatch(updatePlayerPieceValue({
      playerNo: `player${enemyNo}`,
      pieceId: enemyPiece.id,
      pos: 0,
      travelCount: 0
    }));
    dispatch(unfreezeDice());
    return;
  }

  if (diceNo === 6 || travelCount === 57) {
    if (travelCount === 57) {
      playSound('home_win');
      const playerAllPieces = getState().game[`player${playerNo}`];
      if (checkWiningCriteria(playerAllPieces)) {
        dispatch(announceWinner(playerNo));
        playSound('cheer', true);
        return;
      }
      dispatch(updateFireworks(true));
    }
    dispatch(updatePlayerChance({ chancePlayer: playerNo }));
  } else {
    let next = playerNo + 1;
    if (next > 4) next = 1;
    dispatch(updatePlayerChance({ chancePlayer: next }));
  }

  await delay(300);
  dispatch(unfreezeDice());
};
