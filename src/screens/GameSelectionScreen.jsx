import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import Wrapper from '../components/Wrapper';
import { deviceHeight, deviceWidth } from '../constants/Scaling';
import GradientButton from '../components/GradientButton';
import { navigate } from '../helpers/NavigationUtil';
import { playSound } from '../helpers/SoundUtility';
import Logo from '../assets/images/logo.png';
import LottieView from 'lottie-react-native';
import LottieAnimation from '../assets/animation/lottie.json';
import { useIsFocused } from '@react-navigation/native'

const GameSelectionScreen = () => {

  const isFocused = useIsFocused();

  const handleLudoPress = useCallback(() => {
    playSound('ui');
    navigate('Home');
  }, []);

  const handleSnakeLadderPress = useCallback(() => {
    playSound('ui');
    navigate('SnakeLadder');
  }, []);

  useEffect(() => {
    if(isFocused){
      playSound('home', true);
    }
  }, [isFocused]);

  return (
    <Wrapper style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imgContainer}>
          <Image source={Logo} style={styles.img} />
        </View>

        <View style={styles.buttonsContainer}>
          <GradientButton 
            title="LUDO" 
            onPress={handleLudoPress}
            style={styles.gameButton}
          />
          
          <GradientButton 
            title="SNAKE & LADDER" 
            onPress={handleSnakeLadderPress}
            style={styles.gameButton}
          />
        </View>
      </View>

      {/* Static Lottie animation */}
      <View style={styles.lottieContainer}>
        <Pressable
          onPress={()=>{
            playSound('ui');
          }}
        >
          <LottieView 
            hardwareAccelerationAndroid
            source={LottieAnimation}
            autoPlay
            loop
            speed={1}
            style={styles.lottieAnimation}
          />
        </Pressable>
      </View>

      <Text style={styles.footerText}>Designed by - Ananta</Text>
    </Wrapper>
  );
};

export default GameSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // ensures footer stays bottom
    paddingVertical: 10,
  },
  content: {
    alignItems: 'center',
  },
  imgContainer: {
    width: deviceWidth * 0.6,
    height: deviceHeight * 0.22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  img: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  buttonsContainer: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  gameButton: {
    width: deviceWidth * 0.75,
  },
  lottieContainer: {
    position: 'absolute',
    bottom: deviceHeight * 0.05,
    alignItems: 'center',
    zIndex: -1,
  },
  lottieAnimation: {
    height: deviceHeight * 0.35,
    width: deviceHeight * 0.35,
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});
