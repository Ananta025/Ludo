import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
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

  // Use winner directly for visibility, like MenuModal does
  const isVisible = winner !== null;
  
  console.log('WinModal render:', { winner, isVisible });

  const handleNewGame = () => {
    console.log('WinModal: New Game pressed');
    dispatch(resetGame());
    dispatch(announceWinner(null));
    playSound('game_start');
  };

  const handleHome = () => {
    console.log('WinModal: Home pressed');
    dispatch(resetGame());
    dispatch(announceWinner(null));
    resetAndNavigate('Home');
  };

  const handleResume = () => {
    console.log('WinModal: Resume pressed');
    dispatch(announceWinner(null));
  };

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      backdropColor="black"
      backdropOpacity={0.8}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onBackdropPress={handleResume}
      onModalShow={() => console.log('WinModal: Modal shown')}
      onModalHide={() => console.log('WinModal: Modal hidden')}
    >
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.gradientContainer}
      >
        <View style={styles.content}>
          {winner !== null && (
            <View style={styles.pileContainer}>
              <Pile player={winner} color={colorPlayer[winner-1]} />
            </View>
          )}

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

          <View style={styles.buttonContainer}>
            <GradientButton title="NEW GAME" onPress={handleNewGame} />
            <GradientButton title="HOME" onPress={handleHome} />
          </View>
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
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'auto',
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
    zIndex: -5,
    marginTop: 20,
    pointerEvents: 'none',
  },
  girlAnimation: {
    height: 500,
    width: 380,
    position: 'absolute',
    bottom: -200,
    right: -120,
    zIndex: 1,
    pointerEvents: 'none',
  },
});
