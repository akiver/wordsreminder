import React from 'react'
import { ActivityIndicator, TouchableHighlight } from 'react-native'
import { STATUS, STATUS_LOADING } from '@constants/statuses'
import { CorrectIcon } from '@components/svg/correct-icon'
import { Spacer } from '@components/spacer'
import { ThemeContext } from '@contexts/theme-context'
import { SAVE_BUTTON } from '@e2e/ids'

type Props = {
  status: STATUS
  onPress: () => void
  disabled: boolean
}

const SaveButton = ({ status, onPress, disabled = false }: Props) => {
  if (status === STATUS_LOADING) {
    return (
      <Spacer marginRight={10}>
        <ThemeContext.Consumer>
          {({ theme }) => (
            <ActivityIndicator size="large" color={theme.primary025} />
          )}
        </ThemeContext.Consumer>
      </Spacer>
    )
  }

  return (
    <Spacer marginRight={10}>
      <TouchableHighlight
        onPress={onPress}
        disabled={disabled}
        style={{ opacity: disabled ? 0.5 : 1 }}
        testID={SAVE_BUTTON}
      >
        <CorrectIcon />
      </TouchableHighlight>
    </Spacer>
  )
}

export { SaveButton }
