declare module 'react-navigation-tabs' {
  interface TabBarIconProps {
    tintColor: string | null
    focused: boolean
    horizontal: boolean
  }

  export function createBottomTabNavigator(
    routeConfigMap: any,
    drawConfig?: any
  ): any
}
