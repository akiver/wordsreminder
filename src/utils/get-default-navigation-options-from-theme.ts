import { Theme } from '@contexts/theme-context'

const getDefaultNavigationOptionsFromTheme = (theme: Theme) => {
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

export { getDefaultNavigationOptionsFromTheme }
