import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetGame } from '../redux/reducers/gameSlice';
import { playSound } from '../helpers/SoundUtility';
import { resetAndNavigate } from '../helpers/NavigationUtil';
import { announceWinner } from '../redux/reducers/gameSlice';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Trophy from '../assets/animation/trophy.json';
import Firework from '../assets/animation/firework.json';
import GradientButton from './GradientButton';
import HeartGirl from '../assets/animation/girl.json';
import Pile from './Pile';
import { colorPlayer } from '../helpers/PlotData';


const WinModal = ({ winner }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(!!winner);

  useEffect(() => {
    setVisible(!!winner);
  }, [winner]);

  const handleNewGame = () => {
    dispatch(resetGame());
    dispatch(announceWinner(null));
    playSound('game_start');
  };

  const handleHome = () => {
    dispatch(resetGame());
    dispatch(announceWinner(null));
    resetAndNavigate('Home');
  };

  return (
    <Modal
      style={styles.modal}
      isVisible={visible}
      backdropColor="black"
      backdropOpacity={0.8}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onBackdropPress={() => {}}
    >
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.gradientContainer}
      >
        <View style={styles.content}>
          <View style={styles.pileContainer}>
            <Pile player={winner} color={colorPlayer[winner-1]} />
          </View>

          <Text style={styles.congratsText}>
            Congratulations! Player {winner}
          </Text>
          <LottieView
            autoPlay
            hardwareAccelerationAndroid
            loop={false}
            source={Trophy}
            style={styles.trophyAnimation}
          />
          <LottieView
            autoPlay
            hardwareAccelerationAndroid
            loop={true}
            source={Firework}
            style={styles.fireworkAnimation}
          />

          <GradientButton title="NEW GAME" onPress={handleNewGame} />
          <GradientButton title="HOME" onPress={handleHome} />
        </View>
      </LinearGradient>

      <LottieView
        autoPlay
        hardwareAccelerationAndroid
        loop={true}
        source={HeartGirl}
        style={styles.girlAnimation}
      />
    </Modal>
  );
};

export default WinModal;

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '96%',
    borderWidth: 2,
    borderColor: 'gold',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  pileContainer: {
    width: 90,
    height: 40,
  },
  congratsText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'philosopher-Bold',
    marginTop: 10,
  },
  trophyAnimation: {
    height: 200,
    width: 200,
    marginTop: 20,
  },
  fireworkAnimation: {
    height: 200,
    width: 500,
    position: 'absolute',
    zIndex: -1,
    marginTop: 20,
  },
  girlAnimation: {
    height: 500,
    width: 380,
    position: 'absolute',
    bottom: -200,
    right: -120,
    zIndex: 99,
  },
});
