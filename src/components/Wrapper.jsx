import { StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import BG from '../assets/images/bg.png'
import {deviceWidth, deviceHeight} from '../constants/Scaling'
import { SafeAreaView } from 'react-native-safe-area-context'

const Wrapper = ({children, style}) => {
  return (
    <ImageBackground source={BG} resizeMode='cover' style={styles.container}>
        <SafeAreaView style={[styles.SafeAreaView, {...style}]}>
            {children}
        </SafeAreaView>
    </ImageBackground>
  )
}

export default Wrapper

const styles = StyleSheet.create({
    container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SafeAreaView:{
    height: deviceHeight,
    width: deviceWidth,
    justifyContent: 'center',
    alignItems: 'center'
  }
})