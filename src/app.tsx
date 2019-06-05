import React from 'react'
import Config from 'react-native-config'
import { StatusBar, View, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import SplashScreen from 'react-native-splash-screen'
import { themes, ThemeContext, Themes } from '@contexts/theme-context'
import {
  THEME_KEY,
  THEME_DARK_VALUE,
  THEME_LIGHT_VALUE,
} from '@constants/async-storage'
import { AppStack } from '@stacks/app-stack'
import { NavigationState } from 'react-navigation'

type State = typeof initialState

const initialState = Object.freeze({
  theme: themes.dark,
})

const persistenceKey = 'persistenceKey'
const persistNavigationState = async (navState: NavigationState) => {
  try {
    await AsyncStorage.setItem(persistenceKey, JSON.stringify(navState))
  } catch (error) {
    Alert.alert(error)
  }
}

const loadNavigationState = async () => {
  const jsonString = await AsyncStorage.getItem(persistenceKey)
  if (jsonString !== null) {
    return JSON.parse(jsonString)
  }

  return null
}

function getPersistenceFunctions() {
  return __DEV__ && Config.PERSIST_NAVIGATION === 'true'
    ? {
        persistNavigationState,
        loadNavigationState,
      }
    : undefined
}

class App extends React.Component<null, State> {
  readonly state = initialState

  async componentDidMount() {
    try {
      const theme = (await AsyncStorage.getItem(THEME_KEY)) as keyof Themes

      if (theme !== null) {
        this.setState({
          theme: themes[theme],
        })
      }
    } catch (error) {
      // Unable to load theme, just skip it, dark theme will be used.
    } finally {
      SplashScreen.hide()
    }
  }

  handleToggleTheme = () => {
    this.setState(({ theme }) => {
      return {
        theme:
          theme === themes[THEME_DARK_VALUE]
            ? themes[THEME_LIGHT_VALUE]
            : themes[THEME_DARK_VALUE],
      }
    })
  }

  render() {
    const { theme } = this.state
    return (
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
          <AppStack screenProps={{ theme }} {...getPersistenceFunctions()} />
        </View>
      </ThemeContext.Provider>
    )
  }
}

export { App }
