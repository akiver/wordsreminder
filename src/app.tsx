import React, { useState, useEffect } from 'react';
import { NavigationContainer, InitialState, NavigationState } from '@react-navigation/native';
import { View } from 'react-native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStack } from '@stacks/root-stack';
import { ThemeProvider } from './theme/theme-provider';
import { StatusBar } from './status-bar';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

export function App() {
  const [isReady, setIsReady] = useState(__DEV__ && Config.PERSIST_NAVIGATION === 'true' ? false : true);
  const [initialState, setInitialState] = useState<InitialState>();

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
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <StatusBar />
          <RootStack />
        </View>
      </ThemeProvider>
    </NavigationContainer>
  );
}
