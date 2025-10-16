import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import LinearGradinet from 'react-native-linear-gradient'
import Materialicons from 'react-native-vector-icons/MaterialIcons'
import { playSound } from '../helpers/SoundUtility'


const iconsSize = RFValue(18);

const GradientButton = ({ title, onPress, iconColor = "#d5be3e"}) => {
  return (
    <View style={styles.mainContainer}>
        <TouchableOpacity
        style={styles.btnContainer} 
        onPress={()=>{
            playSound('ui');
            onPress && onPress();
        }} 
        activeOpacity={0.8}>
            <LinearGradinet
            colors= {['#4c669f', '#3b5998', '#192f6a']}
            style={styles.btn}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            >
                {
                    title === 'RESUME' ? <Materialicons name='play-arrow' size={iconsSize} color={iconColor} /> :
                    title === 'NEW GAME' ? <Materialicons name='play-arrow' size={iconsSize} color={iconColor} /> :
                    title === 'VS CPU' ? <Materialicons name='smartphone' size={iconsSize} color={iconColor} /> :
                    title === '2 VS 2' ? <Materialicons name='group' size={iconsSize} color={iconColor} /> :
                    title === 'HOME' ? <Materialicons name='home' size={iconsSize} color={iconColor} /> :
                    title === 'USER' ? <Materialicons name='person' size={iconsSize} color={iconColor} /> :
                    null
                }
                <Text style={styles.btnText}>{title}</Text>
            </LinearGradinet>
        </TouchableOpacity>
      
    </View>
  )
}

export default GradientButton

const styles = StyleSheet.create({
    mainContainer:{
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        marginVertical: 10,
    },
    btnContainer: {
        borderWidth: 4,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        shadowColor: '#d5be3e',
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 10,
        borderColor: '#d5be3e',
        width: 250,
    },
    btnText: {
        color: 'white',
        fontSize: RFValue(18),
        width: '70%',
        textAlign: 'left',
        fontFamily: 'Philosopher-Bold',
    },
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    }

})