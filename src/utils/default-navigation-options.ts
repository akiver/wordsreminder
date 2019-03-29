import {
  NavigationScreenConfigProps,
  NavigationStackScreenOptions,
} from 'react-navigation'
import { Theme } from '@contexts/theme-context'

const defaultNavigationOptions = ({
  screenProps,
}: NavigationScreenConfigProps): NavigationStackScreenOptions => {
  const theme = screenProps.theme as Theme
  return {
    headerTintColor: theme.primary025,
    headerStyle: {
      backgroundColor: theme.primary100,
    },
    headerBackTitleStyle: {
      opacity: 0,
    },
  }
}

export { defaultNavigationOptions }
