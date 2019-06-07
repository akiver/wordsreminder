import {
  StyleSheet,
  Animated,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'
import React from 'react'
import { ThemeContext } from '@contexts/theme-context'

type Props = TouchableOpacityProps & {
  isFilled: boolean
  borderInterpolation?: Animated.AnimatedInterpolation
  children?: never
}

const Indicator = ({ isFilled, borderInterpolation, ...props }: Props) => (
  <ThemeContext.Consumer>
    {({ theme }) => (
      <Animated.View
        style={{
          ...styles.container,
          backgroundColor: isFilled ? theme.primary025 : theme.primary100,
          borderWidth: 2,
          borderColor: borderInterpolation || theme.primary025,
        }}
        {...props}
      />
    )}
  </ThemeContext.Consumer>
)

type Style = {
  container: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    height: 20,
    width: 20,
    borderRadius: 20,
  },
})

export { Indicator }
