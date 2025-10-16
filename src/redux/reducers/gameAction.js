import { SafeSpots, StarSpots, turningPoints, victoryStart } from "../../helpers/PlotData";
import { playSound } from "../../helpers/SoundUtility";
import { selectCurrentPositions, selectDiceNo } from "./gameSelectors";
import { announceWinner, disableTouch, unfreezeDice, updateFireworks, updatePlayerChance, updatePlayerPieceValue } from "./gameSlice";

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

  for (let i = 0; i < diceNo; i++) {
    const updatedState = getState();
    const playerPiece = updatedState.game[`player${playerNo}`].find(item => item.id === id);
    let path = playerPiece.pos + 1;

    const playerTurnPoint = turningPoints[playerNo - 1];
    if (path === playerTurnPoint) path = victoryStart[playerNo - 1];
    if (path > 52) path = path - 52;

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

  if (SafeSpots.includes(finalPath) || StarSpots.includes(finalPath)) playSound('safe_spot');

  if (areDifferentIds && !SafeSpots.includes(finalPath) && !StarSpots.includes(finalPath)) {
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
