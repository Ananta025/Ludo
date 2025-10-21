import { StyleSheet, Text, View, Image, Alert, Animated, Pressable } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import Wrapper from '../../components/Wrapper'
import Logo from '../../assets/images/logo.png'
import { deviceHeight, deviceWidth } from '../../constants/Scaling'
import GradientButton from '../../components/GradientButton'
import LottieView from 'lottie-react-native'
import Witch from '../../assets/animation/witch.json'
import { playSound } from '../../helpers/SoundUtility'
import { useIsFocused } from '@react-navigation/native'
import SoundPlayer from 'react-native-sound-player'
import { navigate } from '../../helpers/NavigationUtil'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentPositions } from '../../redux/ludo/ludoSelectors'
import { resetGame } from '../../redux/ludo/ludoSlice'





const HomeScreen = () => {

    const isFocused = useIsFocused();
    const renderButtons = useCallback((title, onPress) => <GradientButton title={title} onPress={onPress} />, [])
    
    const startGame =  async (isNewGame = false) => {
        SoundPlayer.stop()
        if (isNewGame) {
            dispatch(resetGame());
        }
        navigate('LudoBoard');
        playSound('game_start');
    }
    const handleNewGamePress = useCallback(() => {
        startGame(true);
    }, [])

    const handleResumePress = useCallback(() => {
        startGame(false);
    }, [])

    const witchAnim = useRef(new Animated.Value(-deviceWidth)).current;
    const scaleXAnim = useRef(new Animated.Value(1)).current;


    const dispatch = useDispatch();
    const currentPosition = useSelector(selectCurrentPositions);


    useEffect(() => {
        let animation;
        const loopAnimation = () => {
            animation = Animated.loop(
                Animated.sequence([
                    Animated.parallel([
                        Animated.timing(witchAnim, {
                            toValue: deviceWidth * 0.02,
                            duration: 3000,
                            useNativeDriver: true
                        }),
                        Animated.timing(scaleXAnim, {
                            toValue: -1,
                            duration: 0,
                            useNativeDriver: true
                        }),
                    ]),
                    Animated.delay(3000),
                    Animated.parallel([
                        Animated.timing(witchAnim, {
                            toValue: deviceWidth * 2,
                            duration: 3000,
                            useNativeDriver: true
                        }),
                        Animated.timing(scaleXAnim, {
                            toValue: -1,
                            duration: 0,
                            useNativeDriver: true
                        }),
                    ]),
                    Animated.parallel([
                        Animated.timing(witchAnim, {
                            toValue: -deviceWidth * 0.05,
                            duration: 3000,
                            useNativeDriver: true
                        }),
                        Animated.timing(scaleXAnim, {
                            toValue: 1,
                            duration: 0,
                            useNativeDriver: true
                        }),
                    ]),
                    Animated.delay(3000),
                    Animated.parallel([
                        Animated.timing(witchAnim, {
                            toValue: -deviceWidth * 2,
                            duration: 3000,
                            useNativeDriver: true
                        }),
                        Animated.timing(scaleXAnim, {
                            toValue: 1,
                            duration: 0,
                            useNativeDriver: true
                        }),
                    ]),
                ])
            );
            animation.start();
        };

        loopAnimation();
        return () => {
            if (animation) {
                animation.stop();
            }
        };
    }, [witchAnim, scaleXAnim])

    useEffect(() => {
        if (isFocused) {
            playSound('home', true);
        }
    }, [isFocused]);

  return (
    <Wrapper style={styles.mainContainer}>
      <View style={styles.imgContainer}>
        <Image source={Logo} style={styles.img} />
      </View>

      <View style={styles.buttonsContainer}>
        {currentPosition.length !== 0 && renderButtons('RESUME', handleResumePress)}
        {renderButtons('NEW GAME', handleNewGamePress)}
        {renderButtons('VS CPU', () => Alert.alert('Coming Soon! Click new game'))}
        {renderButtons('2 VS 2', () => Alert.alert('Coming Soon! Click new game'))}
      </View>

      <Animated.View
        style={[styles.witchContainer, {transform: [{translateX: witchAnim}, {scaleX: scaleXAnim}]}]}
      >
        <Pressable
          onPress={()=>{
            const random = Math.floor(Math.random() * 3) + 1;
            playSound(`girl${random}`)
          }}
        >
          <LottieView 
            hardwareAccelerationAndroid
            source={Witch}
            autoPlay
            speed={1}
            style={styles.witch}
          />
        </Pressable>
      </Animated.View>

      <Text style={styles.artist}>Designed by - Ananta</Text>
    </Wrapper>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    imgContainer:{
        width: deviceWidth * 0.6,
        height: deviceHeight * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5,
        alignSelf: 'center'
    },
    img: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain'
    },
    buttonsContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 12,
    },
    artist: {
        alignSelf: 'center',
        color: 'white',
        fontWeight: 'bold',
        opacity: 0.7,
        fontStyle: 'italic'
    },
    witchContainer:{
        position: 'absolute',
        bottom: deviceHeight * 0.08,
        alignItems: 'center',
        zIndex: -1,
    },
    witch:{
        height: Math.min(250, deviceHeight * 0.25),
        width: Math.min(250, deviceHeight * 0.25),
        transform: [{rotate: '25deg'}]
    }
})