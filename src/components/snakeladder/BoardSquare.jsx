import { StyleSheet, Text, View, Image } from 'react-native'
import React, { memo, useMemo } from 'react'
import Pile from '../Pile'
import { RFValue } from 'react-native-responsive-fontsize'

// Import flag image
import FlagImage from '../../assets/images/snakeladder/flag.png'

const BoardSquare = ({ 
  number, 
  players, 
  hasSnake, 
  hasLadder, 
  isSnakeHead, 
  isLadderBottom,
  onPress,
  showImages = true 
}) => {

  const squareColor = useMemo(() => {
    // Simple alternating pattern - F5E8E2 for odd, DAA3A0 for even
    const isEvenSquare = number % 2 === 0;
    return isEvenSquare ? '#F5E8E2' : '#b58481ff';
  }, [number]);

  return (
    <View style={[styles.container, { backgroundColor: squareColor }]}>
      {/* Flag image for square 100 (finish line) */}
      {number === 100 && (
        <Image 
          source={FlagImage}
          style={styles.flagImage}
          resizeMode="contain"
        />
      )}

      {/* Square number */}
      <Text style={styles.numberText}>{number}</Text>

      {/* Players on this square - exactly like Ludo Cell */}
      {players?.map((player, index) => {
        const playerNo = player.id;
        const pieceColor = player.color;
        
        return (
          <View
            key={`player-${playerNo}-${index}`}
            style={[
              styles.pieceContainer,
              {
                transform: [
                  { scale: players?.length === 1 ? 0.8 : 0.5 },
                  { translateX: players.length === 1 ? 0 : index % 2 === 0 ? -4 : 4 },
                  { translateY: players.length === 1 ? 0 : index < 2 ? -4 : 4 },
                ]
              }
            ]}
          >
            <Pile
              color={pieceColor}
              player={playerNo}
              cell={true}
              pieceId={`SL${playerNo}`}
              variant="token"
              gameType="snakeladder"
            />
          </View>
        );
      })}
    </View>
  )
}

export default memo(BoardSquare)

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.3,
    borderColor: '#111',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  numberText: {
    fontSize: RFValue(8),
    fontWeight: 'bold',
    color: '#111',
    position: 'absolute',
    top: 1,
    left: 2,
    zIndex: 10,
  },
  flagImage: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: RFValue(35),
    height: RFValue(35),
    zIndex: 10,
  },
  pieceContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 99,
  },
})