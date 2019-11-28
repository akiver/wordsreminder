import { createStackNavigator, NavigationStackScreenProps } from 'react-navigation-stack'
import { AUTH_SIGN_IN_SCREEN, AUTH_SIGN_UP_SCREEN } from '@constants/screens'
import { SignUpScreen } from '@screens/auth/sign-up-screen'
import { SignInScreen } from '@screens/auth/sign-in-screen'
import { Theme } from '@contexts/theme-context'
import { getDefaultNavigationOptionsFromTheme } from '@utils/get-default-navigation-options-from-theme'

type ScreenProps = { theme: Theme }

const AuthStack = createStackNavigator(
  {
    [AUTH_SIGN_IN_SCREEN]: SignInScreen,
    [AUTH_SIGN_UP_SCREEN]: SignUpScreen,
  },
  {
    defaultNavigationOptions: ({ screenProps }: NavigationStackScreenProps) => {
      const theme = (screenProps as ScreenProps).theme as Theme
      return getDefaultNavigationOptionsFromTheme(theme)
    },
  }
)

export { AuthStack }
