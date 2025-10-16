import { Animated, Easing, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React,{memo, useEffect, useMemo, useRef} from 'react'
import { useSelector } from 'react-redux';
import { selectCellSelection, selectPocketPileSelection, selectDiceNo } from '../redux/reducers/gameSelectors';
import {Colors} from '../constants/Colors'
import PileGreen from '../assets/images/piles/green.png'
import PileRed from '../assets/images/piles/red.png'
import PileYellow from '../assets/images/piles/yellow.png'
import PileBlue from '../assets/images/piles/blue.png'
import {Svg, Circle} from 'react-native-svg'

const Pile = ({cell, pieceId, color, player, onPress}) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const currentPlayerPileSelection = useSelector(selectPocketPileSelection);
  const currentPlayerCellSelection = useSelector(selectCellSelection);
  const diceNo = useSelector(selectDiceNo);
  const playerPieces = useSelector(state => state.game[`player${player}`])

  const isPileEnabled = useMemo(
    () => player === currentPlayerPileSelection,
    [player, currentPlayerPileSelection]
  );

  const isCellEnabled = useMemo(
    () => player === currentPlayerCellSelection,
    [player, currentPlayerCellSelection]
  );

  const currentPiece = useMemo(
    () => playerPieces?.find(item => item.id === pieceId),
    [playerPieces, pieceId]
  );

  const isForwardable = useMemo(() => {
    if (!currentPiece || !diceNo) return false;
    return currentPiece.travelCount + diceNo <= 57;
  }, [currentPiece, diceNo]);

  const isSelectable = useMemo(() => {
    if (cell) {
      // For pieces on board - check if cell selection is enabled and piece can move
      return isCellEnabled && isForwardable;
    } else {
      // For pieces at home - check if pile selection is enabled
      return isPileEnabled;
    }
  }, [cell, isCellEnabled, isPileEnabled, isForwardable]);

  const getPileImage = useMemo(() => {
    switch (color) {
      case Colors.green:
        return PileGreen;
      case Colors.red:
        return PileRed;
      case Colors.yellow:
        return PileYellow;
      case Colors.blue:
        return PileBlue;
      default:
        return PileGreen;
    }
  }, [color]);

  // Enhanced animation with proper cleanup
  useEffect(() => {
    let rotateAnimation;
    
    if (isSelectable) {
      rotateAnimation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();
    } else {
      rotation.setValue(0);
    }

    return () => {
      if (rotateAnimation) {
        rotateAnimation.stop();
      }
    };
  }, [rotation, isSelectable]);

  const rotateInterpolate = useMemo(
    () =>
      rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      }),
    [rotation]
  );

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.5}
      disabled={!isSelectable}
      onPress={onPress}
    >
      <View style={styles.hollowCircle}>
        {isSelectable && (
          <View style={styles.dashedCircleContainer}>
            <Animated.View
              style={[styles.dashedCircle, { transform: [{ rotate: rotateInterpolate }] }]}
            >
              <Svg height="18" width="18">
                <Circle
                  cx="9"
                  cy="9"
                  r="8"
                  stroke='white'
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  strokeDashoffset="0"
                  fill="transparent"
                />
              </Svg>
            </Animated.View>
          </View>
        )}
      </View>

      <Image 
        source={getPileImage}
        style={styles.pileImage}
      />
    </TouchableOpacity>
  )
}

export default memo(Pile)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center',
  },
  hollowCircle: {
    width: 15,
    height: 15,
    position: 'absolute',
    borderRadius: 25,
    borderWidth: 2,
    borderBlockColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedCircleContainer: {
    position: 'absolute',
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    top: -8,
  },
  dashedCircle: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pileImage: {
    width: 32,
    height: 32,
    position: 'absolute',
    top: -16,
  },
  dashedCircleImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  }
})