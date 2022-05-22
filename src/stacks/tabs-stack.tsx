import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DICTIONARIES_STACK, SETTINGS_STACK } from '@constants/screens';
import { useTheme } from '@theme/use-theme';
import { DictionaryIcon } from '@components/svg/dictionary-icon';
import { SettingsIcon } from '@components/svg/settings-icon';
import { SettingsStack } from '@stacks/settings-stack';
import { DictionariesStack } from '@stacks/dictionaries-stack';

const Tab = createBottomTabNavigator();

export const TabsStack = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.primary025,
        tabBarStyle: {
          backgroundColor: theme.primary100,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={DICTIONARIES_STACK}
        component={DictionariesStack}
        options={{
          tabBarIcon: DictionaryIcon,
        }}
      />
      <Tab.Screen
        name={SETTINGS_STACK}
        component={SettingsStack}
        options={{
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tab.Navigator>
  );
};
