import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { APP_LOCKER_SCREEN, AUTH_LOADING_SCREEN } from '@constants/screens';
import { useTheme } from '@hooks/use-theme';
import { PasscodeStack } from './passcode-stack';

export type RootStackParamList = {
  [APP_LOCKER_SCREEN]: undefined;
  [AUTH_LOADING_SCREEN]: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName={APP_LOCKER_SCREEN}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary100,
        },
        headerTintColor: theme.white,
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name={APP_LOCKER_SCREEN} component={PasscodeStack} />
    </Stack.Navigator>
  );
};
