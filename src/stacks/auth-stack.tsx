import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AUTH_SIGN_IN_SCREEN, AUTH_SIGN_UP_SCREEN } from '@constants/screens';
import { SignUpScreen } from '@screens/auth/sign-up-screen';
import { SignInScreen } from '@screens/auth/sign-in-screen';
import { useTheme } from '@theme/use-theme';

export type AuthStackParamList = {
  [AUTH_SIGN_IN_SCREEN]: undefined;
  [AUTH_SIGN_UP_SCREEN]: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthStack() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={AUTH_SIGN_IN_SCREEN}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary100,
        },
        headerTintColor: theme.white,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name={AUTH_SIGN_IN_SCREEN}
        component={SignInScreen}
        options={{
          title: 'Sign in',
        }}
      />
      <Stack.Screen
        name={AUTH_SIGN_UP_SCREEN}
        component={SignUpScreen}
        options={{
          title: 'Sign up',
        }}
      />
    </Stack.Navigator>
  );
}
