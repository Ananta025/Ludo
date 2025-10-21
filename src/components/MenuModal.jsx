import { StyleSheet,  View } from 'react-native';
import React, { useCallback } from 'react';
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux';
import { playSound } from '../helpers/SoundUtility';
import { resetGame } from '../redux/ludo/ludoSlice';
import { resetGame as resetSnakeLadderGame } from '../redux/snakeladder/snakeLadderSlice';
import { goBack } from '../helpers/NavigationUtil';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from './GradientButton';

const MenuModal = ({ visible, onPressHide, gameType = 'ludo' }) => {
  const dispatch = useDispatch();

  const handleNewGame = useCallback(() => {
    if (gameType === 'snakeladder') {
      dispatch(resetSnakeLadderGame());
    } else {
      dispatch(resetGame());
    }
    playSound('game_start');
    onPressHide();
  }, [dispatch, onPressHide, gameType]);

  const handleHome = useCallback(() => {
    goBack();
  }, []);

  return (
    <Modal
      isVisible={visible}
      style={styles.bottomModalView}
      backdropColor="black"
      backdropOpacity={0.8}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onBackButtonPress={onPressHide}
    >
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.gradientContainer}
      >
        <View style={styles.subView}>
          <GradientButton title="RESUME" onPress={onPressHide} />
          <GradientButton title="NEW GAME" onPress={handleNewGame} />
          <GradientButton title="HOME" onPress={handleHome} />
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default MenuModal;

const styles = StyleSheet.create({
  bottomModalView: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
  },
  gradientContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    paddingVertical: 40,
    borderWidth: 2,
    borderColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subView: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
