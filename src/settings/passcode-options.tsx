import React from 'react'
import RNSecureStorage from 'rn-secure-storage'
import { Button } from '@components/button'
import { PASSCODE_KEY } from '@constants/async-storage'
import { SETTINGS_TURN_ON_PASSCODE_SCREEN, SETTINGS_TURN_OFF_PASSCODE_SCREEN } from '@constants/screens'
import { Spacer } from '@components/spacer'
import { NavigationStackProp } from 'react-navigation-stack'

type Props = {
  navigation: NavigationStackProp
}
type State = typeof initialState

const initialState = Object.freeze({
  isPasscodeStatusDetected: false,
  isPasscodeEnabled: false,
})

class SettingsPasscodeOptions extends React.Component<Props, State> {
  readonly state = initialState

  async componentDidMount() {
    try {
      const storedPasscodeAsString = await RNSecureStorage.get(PASSCODE_KEY)
      const isPasscodeEnabled = storedPasscodeAsString !== null
      this.setState({
        isPasscodeStatusDetected: true,
        isPasscodeEnabled,
      })
    } catch (error) {
      if (error.code === '404' || error.code === 'EUNSPECIFIED') {
        this.setState({
          isPasscodeStatusDetected: true,
          isPasscodeEnabled: false,
        })
      }

      // Error reading secured storage, don't show passcode options.
    }
  }

  handleTogglePasscode = () => {
    this.props.navigation.push(SETTINGS_TURN_ON_PASSCODE_SCREEN)
  }

  handleTurnOffPasscodePress = () => {
    this.props.navigation.push(SETTINGS_TURN_OFF_PASSCODE_SCREEN)
  }

  render() {
    if (!this.state.isPasscodeStatusDetected) {
      return null
    }

    let options
    if (this.state.isPasscodeEnabled) {
      options = <Button onPress={this.handleTurnOffPasscodePress} text="Turn passcode off" />
    } else {
      options = <Button onPress={this.handleTogglePasscode} text="Turn passcode on" />
    }

    return <Spacer marginBottom={20}>{options}</Spacer>
  }
}

export { SettingsPasscodeOptions }
