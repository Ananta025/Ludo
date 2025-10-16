import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import LudoBoardScreen from "../screens/LudoBoardScreen";
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
            animation : 'fade'
        }}
        name="Home" component={HomeScreen} />
        <Stack.Screen
          options={{
            animation: 'fade'
          }}
          name="LudoBoard" component={LudoBoardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default Navigation;