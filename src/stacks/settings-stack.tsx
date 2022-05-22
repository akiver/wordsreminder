import React from 'react';
import {
  SETTINGS_SCREEN,
  SETTINGS_TURN_OFF_PASSCODE_SCREEN,
  SETTINGS_TURN_ON_PASSCODE_SCREEN,
  AUTH_LOADING_SCREEN,
} from '@constants/screens';
import { SettingsScreen } from '@screens/settings/settings-screen';
import { TurnOffPasscodeScreen } from '@screens/settings/turn-off-passcode';
import { TurnOnPasscodeScreen } from '@screens/settings/turn-on-passcode';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@theme/use-theme';

export type SettingsStackParamList = {
  [SETTINGS_SCREEN]: undefined;
  [SETTINGS_TURN_ON_PASSCODE_SCREEN]: undefined;
  [SETTINGS_TURN_OFF_PASSCODE_SCREEN]: undefined;
  [AUTH_LOADING_SCREEN]: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

export function SettingsStack() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={SETTINGS_SCREEN}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary100,
        },
        headerTintColor: theme.primary025,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name={SETTINGS_SCREEN}
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name={SETTINGS_TURN_OFF_PASSCODE_SCREEN}
        component={TurnOffPasscodeScreen}
        options={{
          title: 'Turn off passcode',
        }}
      />
      <Stack.Screen
        name={SETTINGS_TURN_ON_PASSCODE_SCREEN}
        component={TurnOnPasscodeScreen}
        options={{
          title: 'Turn on passcode',
        }}
      />
    </Stack.Navigator>
  );
}
