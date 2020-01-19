import { StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import React from 'react'
import { Text } from '@components/text'
import { ThemeContext } from '@contexts/theme-context'

type Props = TouchableOpacityProps & {
  children?: never
}

export const DeleteButton = ({ onPress, ...props }: Props) => (
  <ThemeContext.Consumer>
    {({ theme }) => (
      <TouchableOpacity
        onPress={onPress}
        style={{
          ...styles.container,
          backgroundColor: theme.primary100,
          borderColor: theme.primary025,
        }}
        {...props}
      >
        <Text color="primary025" fontSize={16} fontWeight="bold">
          Delete
        </Text>
      </TouchableOpacity>
    )}
  </ThemeContext.Consumer>
)

type Style = {
  container: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    height: 80,
    width: 80,
    borderRadius: 80,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
