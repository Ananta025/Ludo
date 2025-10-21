import {
  StyleSheet,
  View,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentPlayerChance,
  selectDiceNo,
  selectDiceRolled,
} from '../redux/ludo/ludoSelectors';
import {
  selectSnakeLadderCurrentPlayer,
  selectSnakeLadderDiceNo,
  selectSnakeLadderDiceRolled,
} from '../redux/snakeladder/snakeLadderSelectors';
import { BackgroundImage } from '../helpers/GetIcons';
import LinearGradient from 'react-native-linear-gradient';
import Arrow from '../assets/images/arrow.png';
import LottieView from 'lottie-react-native';
import DiceRoll from '../assets/animation/diceroll.json';
import { playSound } from '../helpers/SoundUtility';
import {
  enablePileSelection,
  updateDiceNo,
  updatePlayerChance,
  enableCellSelection,
  updatePlayerPieceValue,
  unfreezeDice,
} from '../redux/ludo/ludoSlice';
import { updateDiceNo as updateSnakeLadderDiceNo } from '../redux/snakeladder/snakeLadderSlice';
import { handleForwardThunk } from '../redux/ludo/ludoActions';
import { handleSnakeLadderMoveThunk } from '../redux/snakeladder/snakeLadderActions';

const Dice = React.memo(({ 
  gameType = 'ludo', 
  color, 
  rotate, 
  player, 
  data, 
  onPress, 
  diceNo: propDiceNo, 
  isDiceRolled: propIsDiceRolled, 
  currentPlayerChance: propCurrentPlayerChance 
}) => {
  const dispatch = useDispatch();
  
  // Use different selectors based on game type
  const ludoCurrentPlayerChance = useSelector(selectCurrentPlayerChance);
  const ludoIsDiceRolled = useSelector(selectDiceRolled);
  const ludoDiceNo = useSelector(selectDiceNo);
  
  const snakeLadderCurrentPlayer = useSelector(selectSnakeLadderCurrentPlayer);
  const snakeLadderIsDiceRolled = useSelector(selectSnakeLadderDiceRolled);
  const snakeLadderDiceNo = useSelector(selectSnakeLadderDiceNo);
  
  // Use appropriate values based on game type
  const currentPlayerChance = gameType === 'ludo' 
    ? ludoCurrentPlayerChance 
    : propCurrentPlayerChance || snakeLadderCurrentPlayer;
  const isDiceRolled = gameType === 'ludo' 
    ? ludoIsDiceRolled 
    : propIsDiceRolled || snakeLadderIsDiceRolled;
  const diceNo = gameType === 'ludo' 
    ? ludoDiceNo 
    : propDiceNo || snakeLadderDiceNo;
  
  const pileIcon = BackgroundImage.GetImage(color);
  const diceIcon = BackgroundImage.GetImage(diceNo);
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const arrowAnim = useRef(new Animated.Value(0)).current;

  const [diceRolling, setDiceRolling] = useState(false);

  const handleDicePress = async () => {
    if (gameType === 'snakeladder') {
      // Snake & Ladder logic
      const newDiceNo = Math.floor(Math.random() * 6) + 1;
      playSound('dice_roll');
      setDiceRolling(true);
      await delay(800);
      
      dispatch(updateSnakeLadderDiceNo({ diceNo: newDiceNo }));
      setDiceRolling(false);
      
      // Auto-move player after a short delay
      setTimeout(() => {
        dispatch(handleSnakeLadderMoveThunk(player, newDiceNo));
      }, 500);
      
      return;
    }
    
    // Original Ludo logic
    const newDiceNo = Math.floor(Math.random() * 6) + 1;
    // const newDiceNo = 6;
    playSound('dice_roll');
    setDiceRolling(true);
    await delay(800);
    dispatch(updateDiceNo({ diceNo: newDiceNo }));
    setDiceRolling(false);

    // Get all valid moves
    const validMoves = [];
    // Include pieces that are on board OR in victory lane (travelCount < 57 means not finished)
    const piecesOnBoard = data.filter(p => p.pos > 0 && p.travelCount < 57);
    const piecesAtHome = data.filter(p => p.pos === 0);

    // Check home pieces (can only move with 6)
    if (newDiceNo === 6) {
      piecesAtHome.forEach(piece => {
        validMoves.push({
          type: 'home',
          piece: piece,
          playerNo: player,
        });
      });
    }

    // Check pieces on board (can move with any number if valid)
    piecesOnBoard
      .filter(p => p.travelCount + newDiceNo <= 57)
      .forEach(piece => {
        // Check if piece is in victory lane based on travelCount (51+ means entered victory path)
        const isInVictoryLane = piece.travelCount >= 51;

        validMoves.push({
          type: isInVictoryLane ? 'victory' : 'board',
          piece: piece,
          playerNo: player,
        });
      });

    if (validMoves.length === 0) {
      // No valid moves - pass turn
      let next = player + 1;
      if (next > 4) next = 1;
      await delay(500);
      dispatch(updatePlayerChance({ chancePlayer: next }));
    } else if (validMoves.length === 1) {
      // Auto-move: only one valid move
      await delay(500);
      const move = validMoves[0];

      if (move.type === 'home') {
        // Move from home to starting position
        const startingPos = [1, 14, 27, 40][player - 1];
        dispatch(
          updatePlayerPieceValue({
            playerNo: `player${player}`,
            pieceId: move.piece.id,
            pos: startingPos,
            travelCount: 1,
          }),
        );
      } else {
        // Move piece on board or in victory lane
        dispatch(
          handleForwardThunk(player, move.piece.id, move.piece.pos)
        );
      }

      // Check if player gets another turn (rolled 6)
      if (newDiceNo !== 6) {
        await delay(1000);
        let next = player + 1;
        if (next > 4) next = 1;
        dispatch(updatePlayerChance({ chancePlayer: next }));
      } else {
        dispatch(unfreezeDice());
      }
    } else {
      // Multiple valid moves - enable selections based on what's available
      const hasHomePieces = newDiceNo === 6 && piecesAtHome.length > 0;
      const hasBoardPieces = piecesOnBoard.filter(p => {
        const canMove = p.travelCount + newDiceNo <= 57;
        if (!canMove) return false;
        
        // Check if piece is NOT in victory lane (regular board pieces)
        // Use travelCount to determine if piece has entered victory path (51+ moves)
        const isInVictoryLane = p.travelCount >= 51;
        
        return !isInVictoryLane; // Only count non-victory lane pieces for cell selection
      }).length > 0;

      const hasVictoryPieces = piecesOnBoard.filter(p => {
        const canMove = p.travelCount + newDiceNo <= 57;
        if (!canMove) return false;
        
        // Check if piece IS in victory lane
        // Use travelCount to determine if piece has entered victory path (51+ moves)
        const isInVictoryLane = p.travelCount >= 51;
        
        return isInVictoryLane; // Only count victory lane pieces
      }).length > 0;

      // Enable appropriate selections
      if (hasHomePieces) {
        dispatch(enablePileSelection({ playerNo: player }));
      }
      if (hasBoardPieces || hasVictoryPieces) {
        dispatch(enableCellSelection({ playerNo: player }));
      }
    }
  };


  useEffect(() => {
    const animateArrow = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowAnim, {
            toValue: 10,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(arrowAnim, {
            toValue: -10,
            duration: 400,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    animateArrow();
  }, [arrowAnim, currentPlayerChance, isDiceRolled]);


  return (
    <View
      style={[styles.flexRow, { transform: [{ scaleX: rotate ? -1 : 1 }] }]}
    >
      <View style={styles.border1}>
        <LinearGradient
          style={styles.linearGradient}
          colors={['#0052be', '#5f9fcb', '#97c6c9']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <View style={styles.pileContainer}>
            <Image source={pileIcon} style={styles.pileIcon} />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.border2}>
        <LinearGradient
          style={styles.diceGradient}
          colors={['#aac8ab', '#aac8ab', '#aac8ab']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <View style={styles.diceContainer}>
            {currentPlayerChance === player ? (
              <>
                {diceRolling ? null : (
                  <TouchableOpacity
                    disabled={isDiceRolled}
                    activeOpacity={0.4}
                    onPress={handleDicePress}
                  >
                    <Image source={diceIcon} style={styles.dice} />
                  </TouchableOpacity>
                )}
              </>
            ) : null}
          </View>
        </LinearGradient>
      </View>

      {currentPlayerChance === player && !isDiceRolled ? (
        <Animated.View style={[{ transform: [{ translateX: arrowAnim }] }]}>
          <Image source={Arrow} style={styles.arrow} />
        </Animated.View>
      ) : null}

      {currentPlayerChance === player && diceRolling ? (
        <LottieView
          source={DiceRoll}
          style={styles.rollingDice}
          autoPlay
          loop={false}
          cacheComposition={true}
          hardwareAccelerationAndroid={true}
        />
      ) : null}
    </View>
  );
});

export default Dice;

const styles = StyleSheet.create({
  flexRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pileIcon: {
    width: 30,
    height: 35,
  },
  diceContainer: {
    backgroundColor: '#e8c0c1',
    
    borderWidth: 1,
    borderRadius: 5,
    width: 55,
    height: 55,
    paddingHorizontal: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pileContainer: {
    paddingHorizontal: 3,
  },
  linearGradient: {
    padding: 1,
    borderWidth: 3,
    borderRightWidth: 0,
    borderColor: '#f0ce2c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    width: 45,
    height: 45,
  },
  rollingDice: {
    height: 80,
    width: 80,
    zIndex: 99,
    top: -25,
    position: 'absolute',
  },
  diceGradient: {
    borderWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#f0ce2c',
    justifyContent: 'center',
    borderRadius:5,
    alignItems: 'center',
  },
  border1: {
    borderWidth: 3,
    borderRightWidth: 0,
    borderColor: '#f0ce2c',
  },
  border2: {
    borderWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#aac8ab',
    backgroundColor: '#aac8ab',
    borderRadius: 10,
    padding: 1,
  },
  arrow: {
    width: 30,
    height: 30,
  },
});
