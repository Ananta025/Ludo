import { StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { 
  selectSnakeLadderPlayer1,
  selectSnakeLadderPlayer2, 
  selectSnakeLadderPlayer3,
  selectSnakeLadderPlayer4,
} from '../../redux/snakeladder/snakeLadderSelectors'
import Pile from '../Pile'

const PileArea = () => {
  const player1 = useSelector(selectSnakeLadderPlayer1);
  const player2 = useSelector(selectSnakeLadderPlayer2);
  const player3 = useSelector(selectSnakeLadderPlayer3);
  const player4 = useSelector(selectSnakeLadderPlayer4);
  
  const players = [player1, player2, player3, player4];

  return (
    <View style={styles.container}>
      <View style={styles.pileContainer}>
        {players.map((player) => {
          // Only show unstarted players in pile area
          if (player.hasStarted) return null;
          
          return (
            <View key={player.id} style={styles.pileWrapper}>
              <Pile
                color={player.color}
                player={player.id}
                cell={false}
                pieceId={`SL${player.id}`}
                variant="default"
                gameType="snakeladder"
              />
            </View>
          );
        })}
      </View>
    </View>
  )
}

export default memo(PileArea)

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: '-1%',
        alignSelf: 'center',
        backgroundColor: '#eee',
        borderRadius: 10,
        padding: 4,
    },
    pileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pileWrapper: {
        width: 24,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
})