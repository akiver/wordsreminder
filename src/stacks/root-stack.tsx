import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AUTH_LOADING_SCREEN, PASSCODE_STACK } from '@constants/screens';
import { useTheme } from '@theme/use-theme';
import { PasscodeStack } from '@stacks/passcode-stack';

export type RootStackParamList = {
  [PASSCODE_STACK]: undefined;
  [AUTH_LOADING_SCREEN]: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootStack() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={PASSCODE_STACK}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary100,
        },
        headerTintColor: theme.white,
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name={PASSCODE_STACK} component={PasscodeStack} />
    </Stack.Navigator>
  );
}
