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
import { selectDiceTouch, selectPlayer1, selectPlayer2, selectPlayer3, selectPlayer4 } from '../../redux/ludo/ludoSelectors'
import WinModal from '../../components/WinModal'
import Dice from '../../components/Dice'
import {Colors} from '../../constants/Colors'
import Pocket from '../../components/ludo/Pocket'    
import Verticalpath from '../../components/ludo/path/Verticalpath'
import Horizontalpath from '../../components/ludo/path/Horizontalpath'
import {Plot2Data, Plot4Data, Plot1Data, Plot3Data } from '../../helpers/PlotData'         
import FourTriangles from '../../components/ludo/FourTriangles'

const LudoBoardScreen = () => {

  const player1 = useSelector(selectPlayer1);
  const player2 = useSelector(selectPlayer2);
  const player3 = useSelector(selectPlayer3);
  const player4 = useSelector(selectPlayer4);
  const isDiceTouched = useSelector(selectDiceTouch);
  const winner = useSelector((state) => state.game.winner);


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
  }, [isFocused]);

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
          <Dice color={Colors.green} player={2} data={player2} rotate={false}/>
          <Dice color={Colors.yellow} player={3} data={player3} rotate={true}/>
        </View>
        <View style={styles.ludoBoard}>
          <View style={styles.plotContainer}>
            <Pocket color={Colors.green} player={2} data={player2} />
            <Verticalpath cells={Plot2Data} color={Colors.yellow}  />
            <Pocket color={Colors.yellow} player={3} data={player3} />
          </View>
          <View style={styles.pathContainer}>
            <Horizontalpath cells={Plot1Data} color={Colors.green} />
            <FourTriangles
            player1={player1}
            player2={player2}
            player3={player3}
            player4={player4}
            />
            <Horizontalpath cells={Plot3Data} color={Colors.blue} />
          </View>
          <View style={styles.plotContainer}>
            <Pocket color={Colors.red} player={1} data={player1} />
            <Verticalpath cells={Plot4Data} color={Colors.red} />
            <Pocket color={Colors.blue} player={4} data={player4} />
          </View>
        </View>
        <View 
        style={styles.flexRow}
        pointerEvents={isDiceTouched ? 'none' : 'auto'}
        >
          <Dice color={Colors.red} player={1} data={player1} rotate={false} />
          <Dice color={Colors.blue} player={4} data={player4} rotate={true}/>
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
        />
      )}


      <WinModal winner={winner} />
    </Wrapper>
  )
}

export default LudoBoardScreen

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: deviceHeight * 0.5,
    width: deviceWidth,
  },
  ludoBoard: {
    height: '100%',
    width: '100%',
    paddingVertical: 10,
    alignSelf: 'center',
  },
  menuIcon: {
    position: 'absolute',
    top: 60,
    left: 24,
  },
  menuIconImage: {
    width: 30,
    height: 30,
  },
  startImage: {
    position: 'absolute',
  },
  flexRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  plotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '40%',
    backgroundColor: '#ccc'
  },
  pathContainer:{
    width: '100%',
    height: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1e5162'
  }
});