import { StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import React from 'react'
import { Text } from '@components/text'
import { ThemeContext } from '@contexts/theme-context'

type Props = TouchableOpacityProps & {
  text: string
  children?: never
}

const Button = ({ onPress, text, ...props }: Props) => (
  <ThemeContext.Consumer>
    {({ theme }) => (
      <TouchableOpacity
        onPress={onPress}
        style={{
          ...styles.container,
          backgroundColor: theme.primary025,
          ...(props.disabled && styles.disabled),
        }}
        {...props}
        accessibilityRole="button"
      >
        <Text color="primary100" fontSize={16} fontWeight="bold">
          {text}
        </Text>
      </TouchableOpacity>
    )}
  </ThemeContext.Consumer>
)

type Style = {
  container: ViewStyle
  disabled: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  disabled: {
    opacity: 0.3,
  },
})

export { Button }
