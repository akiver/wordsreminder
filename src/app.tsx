import React, { useState, useEffect } from 'react';
import { NavigationContainer, InitialState, NavigationState } from '@react-navigation/native';
import { StatusBar, View } from 'react-native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from 'react-native-bootsplash';
import { themes, ThemeContext, Themes } from '@contexts/theme-context';
import { THEME_KEY, THEME_DARK_VALUE, THEME_LIGHT_VALUE } from '@constants/async-storage';
import { RootStack } from '@stacks/root-stack';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

export const App = () => {
  const [theme, setTheme] = useState(themes.dark);
  const [isReady, setIsReady] = useState(__DEV__ && Config.PERSIST_NAVIGATION === 'true' ? false : true);
  const [initialState, setInitialState] = useState<InitialState>();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = (await AsyncStorage.getItem(THEME_KEY)) as keyof Themes;

        if (theme !== null) {
          setTheme(themes[theme]);
        }
      } catch (error) {
        // Unable to load theme, just skip it, dark theme will be used.
      } finally {
        RNBootSplash.hide();
      }
    };

    loadTheme();
  });

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        if (savedStateString !== null) {
          const state = JSON.parse(savedStateString);
          setInitialState(state);
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  const onStateChange = (newState: NavigationState | undefined) => {
    return AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(newState));
  };

  return (
    <NavigationContainer initialState={initialState} onStateChange={onStateChange}>
      <ThemeContext.Provider
        value={{
          theme,
          toggleTheme: () => {
            setTheme(theme === themes[THEME_DARK_VALUE] ? themes[THEME_LIGHT_VALUE] : themes[THEME_DARK_VALUE]);
          },
        }}
      >
        <View style={{ flex: 1 }}>
          <StatusBar
            backgroundColor={theme.primary100}
            barStyle={theme === themes.dark ? 'light-content' : 'dark-content'}
          />
          <RootStack />
        </View>
      </ThemeContext.Provider>
    </NavigationContainer>
  );
};
