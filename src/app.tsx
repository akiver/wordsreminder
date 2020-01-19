import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { StatusBar, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNBootSplash from 'react-native-bootsplash';
import { themes, ThemeContext, Themes } from '@contexts/theme-context';
import { THEME_KEY, THEME_DARK_VALUE, THEME_LIGHT_VALUE } from '@constants/async-storage';
import { RootStack } from '@stacks/root-stack';

type State = typeof initialState;

const initialState = Object.freeze({
  theme: themes.dark,
});

export class App extends React.Component<{}, State> {
  readonly state = initialState;

  async componentDidMount() {
    try {
      const theme = (await AsyncStorage.getItem(THEME_KEY)) as keyof Themes;

      if (theme !== null) {
        this.setState({
          theme: themes[theme],
        });
      }
    } catch (error) {
      // Unable to load theme, just skip it, dark theme will be used.
    } finally {
      RNBootSplash.hide();
    }
  }

  handleToggleTheme = () => {
    this.setState(({ theme }) => {
      return {
        theme: theme === themes[THEME_DARK_VALUE] ? themes[THEME_LIGHT_VALUE] : themes[THEME_DARK_VALUE],
      };
    });
  };

  render() {
    const { theme } = this.state;
    return (
      <NavigationNativeContainer>
        <ThemeContext.Provider
          value={{
            theme,
            toggleTheme: this.handleToggleTheme,
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
      </NavigationNativeContainer>
    );
  }
}
