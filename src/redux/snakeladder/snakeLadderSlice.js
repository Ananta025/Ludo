import { createSlice } from '@reduxjs/toolkit';
import { snakeLadderInitialState } from './initialState';

export const snakeLadderSlice = createSlice({
  name: 'snakeladder',
  initialState: snakeLadderInitialState,
  reducers: {
    resetGame: (state) => {
      return snakeLadderInitialState;
    },
    
    announceWinner: (state, action) => {
      state.winner = action.payload;
    },
    
    updateFireworks: (state, action) => {
      state.fireworks = action.payload;
    },
    
    updateDiceNo: (state, action) => {
      state.diceNo = action.payload.diceNo;
      state.isDiceRolled = true;
    },
    
    updatePlayerChance: (state, action) => {
      state.chancePlayer = action.payload.chancePlayer;
      state.touchDiceBlock = false;
      state.isDiceRolled = false;
    },
    
    unfreezeDice: (state) => {
      state.touchDiceBlock = false;
      state.isDiceRolled = false;
    },
    
    disableTouch: (state) => {
      state.touchDiceBlock = true;
    },
    
    updatePlayerPosition: (state, action) => {
      const { playerNo, newPosition } = action.payload;
      const playerKey = `player${playerNo}`;
      if (state[playerKey]) {
        state[playerKey].position = newPosition;
        // If moving to position 1 or greater, mark as started
        if (newPosition >= 1) {
          state[playerKey].hasStarted = true;
        }
      }
    },
    
    startPlayer: (state, action) => {
      const { playerNo } = action.payload;
      const playerKey = `player${playerNo}`;
      if (state[playerKey]) {
        state[playerKey].position = 1; // Move to starting square
        state[playerKey].hasStarted = true;
        // Reset pile selection after starting
        state.pileSelectionPlayer = -1;
      }
    },
    
    enablePileSelection: (state, action) => {
      const { playerNo } = action.payload;
      state.touchDiceBlock = true;
      state.pileSelectionPlayer = playerNo;
    },
    
    disablePileSelection: (state) => {
      state.pileSelectionPlayer = -1;
    },
  },
});

export const {
  resetGame,
  announceWinner,
  updateFireworks,
  updateDiceNo,
  updatePlayerChance,
  unfreezeDice,
  disableTouch,
  updatePlayerPosition,
  startPlayer,
  enablePileSelection,
  disablePileSelection
} = snakeLadderSlice.actions;

export default snakeLadderSlice.reducer;
