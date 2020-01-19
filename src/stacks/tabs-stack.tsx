import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DICTIONARIES_SCREEN, SETTINGS_SCREEN } from '@constants/screens';
import { useTheme } from '@hooks/use-theme';
import { DictionaryIcon } from '@components/svg/dictionary-icon';
import { SettingsIcon } from '@components/svg/settings-icon';
import { SettingsStack } from './settings-stack';
import { DictionariesStack } from './dictionaries-stack';

const Tab = createBottomTabNavigator();

export const TabsStack = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        activeTintColor: theme.primary025,
        style: {
          backgroundColor: theme.primary100,
        },
      }}
    >
      <Tab.Screen
        name={DICTIONARIES_SCREEN}
        component={DictionariesStack}
        options={{
          tabBarIcon: DictionaryIcon,
        }}
      />
      <Tab.Screen
        name={SETTINGS_SCREEN}
        component={SettingsStack}
        options={{
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tab.Navigator>
  );
};
