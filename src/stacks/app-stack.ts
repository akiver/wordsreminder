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
    }
  )
)
export { AppStack }
