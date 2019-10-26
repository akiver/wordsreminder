import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import {
  APP_LOCKER_SCREEN,
  APP_STACK,
  AUTH_STACK,
  AUTH_LOADING_SCREEN,
} from '@constants/screens'
import { LockerScreen } from '@screens/locker-screen'
import { MainStack } from './main-stack'
import { AuthStack } from './auth-stack'
import { AuthLoadingScreen } from '@screens/auth/auth-loading-screen'
import { getDefaultNavigationOptionsFromTheme } from '@utils/get-default-navigation-options-from-theme'
import { Theme } from '@contexts/theme-context'

type ScreenProps = {
  theme: Theme
}

const AppStack = createAppContainer(
  createSwitchNavigator(
    {
      [APP_LOCKER_SCREEN]: LockerScreen,
      [APP_STACK]: MainStack,
      [AUTH_STACK]: AuthStack,
      [AUTH_LOADING_SCREEN]: AuthLoadingScreen,
    },
    {
      initialRouteName: APP_LOCKER_SCREEN,
      defaultNavigationOptions: ({ screenProps }) => {
        const theme = (screenProps as ScreenProps).theme
        return getDefaultNavigationOptionsFromTheme(theme)
      },
    }
  )
)
export { AppStack }
