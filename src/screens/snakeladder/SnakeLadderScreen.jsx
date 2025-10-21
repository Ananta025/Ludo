import { StyleSheet, View, TouchableOpacity, Image, Animated } from 'react-native'
import React, { useCallback, useEffect, useRef, useState} from 'react'
import { deviceHeight, deviceWidth } from '../../constants/Scaling'
import Wrapper from '../../components/Wrapper'
import menuIcon from '../../assets/images/menu.png'
import { playSound } from '../../helpers/SoundUtility'
import MenuModal from '../../components/MenuModal'
import StartGame from '../../assets/images/start.png'
import { useIsFocused } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectSnakeLadderTouchDiceBlock, selectSnakeLadderPlayer1, selectSnakeLadderPlayer2, selectSnakeLadderPlayer3, selectSnakeLadderPlayer4 } from '../../redux/snakeladder/snakeLadderSelectors'
import WinModal from '../../components/WinModal'
import Dice from '../../components/Dice'
import {Colors} from '../../constants/Colors'
import Board from '../../components/snakeladder/Board'
import PileArea from '../../components/snakeladder/PileArea'

const SnakeLadderScreen = () => {

  const player1 = useSelector(selectSnakeLadderPlayer1);
  const player2 = useSelector(selectSnakeLadderPlayer2);
  const player3 = useSelector(selectSnakeLadderPlayer3);
  const player4 = useSelector(selectSnakeLadderPlayer4);
  const isDiceTouched = useSelector(selectSnakeLadderTouchDiceBlock);
  const winner = useSelector((state) => state.snakeladder.winner);


  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(1)).current;

  const [menuVisible, setMenuVisible] = useState(false);
  const [showStartImage, setShowStartImage] = useState(false);

  const handleMenuPress = useCallback(() => {
    playSound('ui');
    setMenuVisible(true);
  }, []);


  useEffect(() => {
    if (isFocused) {
      setShowStartImage(true);
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          })
        ])
      )

      blinkAnimation.start();

      const timeout = setTimeout(() => {
        blinkAnimation.stop();
        setShowStartImage(false);
      }, 3000);

      return () => {
        clearTimeout(timeout);
        blinkAnimation.stop();
      }
    }
  }, [isFocused, opacity]);

  return (
    <Wrapper>
      <TouchableOpacity
      onPress={handleMenuPress}
      style={styles.menuIcon}
      >
        <Image source={menuIcon} style={styles.menuIconImage} />
      </TouchableOpacity>

      <View style={styles.container}>
        <View 
        style={styles.flexRow}
        pointerEvents={isDiceTouched ? 'none' : 'auto'}
        >
          <Dice gameType="snakeladder" color={Colors.green} player={2} data={player2} rotate={false}/>
          <Dice gameType="snakeladder" color={Colors.yellow} player={3} data={player3} rotate={true}/>
        </View>
        <View style={styles.snakeLadderBoard}>
          <Board />
          <PileArea />
        </View>
        <View 
        style={styles.flexRow}
        pointerEvents={isDiceTouched ? 'none' : 'auto'}
        >
          <Dice gameType="snakeladder" color={Colors.red} player={1} data={player1} rotate={false} />
          <Dice gameType="snakeladder" color={Colors.blue} player={4} data={player4} rotate={true}/>
        </View>
      </View>


      {showStartImage && (
        <Animated.Image
          source={StartGame}
          style={[
            styles.startImage,
            {
              width: deviceWidth * 0.5,
              height: deviceWidth * 0.2,
              opacity: opacity,
            }
          ]}
        />
      )}
      {menuVisible && (
        <MenuModal 
        onPressHide={() => setMenuVisible(false)}
        visible={menuVisible}
        gameType="snakeladder"
        />
      )}


      <WinModal winner={winner} />
    </Wrapper>
  )
}

export default SnakeLadderScreen

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    height: deviceHeight * 0.85,
    width: deviceWidth,
  },
  snakeLadderBoard: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    position: 'absolute',
    top: 55,
    left: 15,
    zIndex: 100,
  },
  menuIconImage: {
    width: 25,
    height: 25,
  },
  startImage: {
    position: 'absolute',
  },
  flexRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 80, // Fixed height for dice rows
  },
});