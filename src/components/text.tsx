import React from 'react'
import { Text as RNText, TextProps } from 'react-native'
import { ThemeContext, Theme } from '@contexts/theme-context'

type Props = TextProps & {
  color?: keyof Theme
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  children: string
}

const Text = ({ onPress, color = 'primary025', fontSize = 16, fontWeight, children, style, ...props }: Props) => (
  <ThemeContext.Consumer>
    {({ theme }) => {
      return (
        <RNText
          style={Object.assign(
            {
              color: theme[color],
              fontSize,
              fontWeight,
            },
            style
          )}
          onPress={onPress}
          {...props}
        >
          {children}
        </RNText>
      )
    }}
  </ThemeContext.Consumer>
)

export { Text }
