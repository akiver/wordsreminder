import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AUTH_LOADING_SCREEN, PASS_CODE_STACK } from '@constants/screens';
import { useTheme } from '@hooks/use-theme';
import { PasscodeStack } from './passcode-stack';

export type RootStackParamList = {
  [PASS_CODE_STACK]: undefined;
  [AUTH_LOADING_SCREEN]: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName={PASS_CODE_STACK}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary100,
        },
        headerTintColor: theme.white,
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name={PASS_CODE_STACK} component={PasscodeStack} />
    </Stack.Navigator>
  );
};
