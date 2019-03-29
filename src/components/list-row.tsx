import React, { ReactNode } from 'react'
import { StyleSheet, TouchableHighlight, ViewStyle } from 'react-native'
import { ThemeContext } from '@contexts/theme-context'

type Props = {
  onPress?: () => void
  testID: string
  children: ReactNode
}

const ListRow = ({ onPress, testID, children }: Props) => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <TouchableHighlight
          underlayColor={theme.primary075}
          style={[
            styles.container,
            {
              backgroundColor: theme.primary100,
              borderBottomColor: theme.primary025,
            },
          ]}
          onPress={onPress}
          testID={testID}
        >
          {children}
        </TouchableHighlight>
      )}
    </ThemeContext.Consumer>
  )
}

type Style = {
  container: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 10,
  },
})

export { ListRow }
