import { createStackNavigator } from 'react-navigation'
import { AUTH_SIGN_IN_SCREEN, AUTH_SIGN_UP_SCREEN } from '@constants/screens'
import { SignUpScreen } from '@screens/auth/sign-up-screen'
import { SignInScreen } from '@screens/auth/sign-in-screen'
import { defaultNavigationOptions } from '@utils/default-navigation-options'

const AuthStack = createStackNavigator(
  {
    [AUTH_SIGN_IN_SCREEN]: SignInScreen,
    [AUTH_SIGN_UP_SCREEN]: SignUpScreen,
  },
  {
    defaultNavigationOptions,
  }
)

export { AuthStack }
