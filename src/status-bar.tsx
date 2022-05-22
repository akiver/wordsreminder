import React from 'react';
import { StatusBar as RNStatusBar } from 'react-native';
import { useTheme } from '@theme/use-theme';
import { themes } from '@theme/theme-context';

export function StatusBar() {
  const theme = useTheme();

  return (
    <RNStatusBar
      backgroundColor={theme.primary100}
      barStyle={theme === themes.dark ? 'light-content' : 'dark-content'}
    />
  );
}
