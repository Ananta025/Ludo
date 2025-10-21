import { combineReducers } from "redux";
import  gameReducer from "./ludo/ludoSlice";
import snakeLadderReducer from "./snakeladder/snakeLadderSlice";

const rootReducer = combineReducers({
    game: gameReducer,
    snakeladder: snakeLadderReducer,
});

export default rootReducer;
