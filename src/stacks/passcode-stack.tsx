import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { APP_LOCKER_SCREEN, AUTH_LOADING_SCREEN } from '@constants/screens';
import { LockerScreen } from '@screens/locker-screen';
import { AuthLoadingScreen } from '@screens/auth/auth-loading-screen';

type PasscodeStackParamList = {
  [APP_LOCKER_SCREEN]: undefined;
  [AUTH_LOADING_SCREEN]: undefined;
};

const Stack = createStackNavigator<PasscodeStackParamList>();

export const PasscodeStack = () => {
  return (
    <Stack.Navigator
      mode="modal"
      initialRouteName={APP_LOCKER_SCREEN}
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name={APP_LOCKER_SCREEN} component={LockerScreen} />
      <Stack.Screen
        name={AUTH_LOADING_SCREEN}
        component={AuthLoadingScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
