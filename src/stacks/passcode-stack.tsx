import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LOCK_SCREEN, AUTH_LOADING_SCREEN } from '@constants/screens';
import { LockScreen } from '@screens/lock-screen';
import { AuthLoadingScreen } from '@screens/auth/auth-loading-screen';

type PasscodeStackParamList = {
  [LOCK_SCREEN]: undefined;
  [AUTH_LOADING_SCREEN]: undefined;
};

const Stack = createStackNavigator<PasscodeStackParamList>();

export function PasscodeStack() {
  return (
    <Stack.Navigator
      initialRouteName={LOCK_SCREEN}
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
        animationEnabled: false,
      }}
    >
      <Stack.Screen name={LOCK_SCREEN} component={LockScreen} />
      <Stack.Screen
        name={AUTH_LOADING_SCREEN}
        component={AuthLoadingScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
