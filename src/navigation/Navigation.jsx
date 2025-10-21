import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SplashScreen from "../screens/SplashScreen";
import GameSelectionScreen from "../screens/GameSelectionScreen";
import HomeScreen from "../screens/ludo/HomeScreen";
import LudoBoardScreen from "../screens/ludo/LudoBoardScreen";
import SnakeLadderScreen from "../screens/snakeladder/SnakeLadderScreen";
import { navigationRef } from "../helpers/NavigationUtil"



const Stack = createNativeStackNavigator();


const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          options={{
            animation: 'fade'
          }}
          name="GameSelection" component={GameSelectionScreen} />
        <Stack.Screen
        options={{
            animation : 'fade'
        }}
        name="Home" component={HomeScreen} />
        <Stack.Screen
          options={{
            animation: 'fade'
          }}
          name="LudoBoard" component={LudoBoardScreen} />
        <Stack.Screen
          options={{
            animation: 'fade'
          }}
          name="SnakeLadder" component={SnakeLadderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default Navigation;