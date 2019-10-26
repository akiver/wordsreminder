import React from 'react'
import { NavigationActions, StackActions } from 'react-navigation'
import {
  NavigationStackScreenProps,
  NavigationStackOptions,
} from 'react-navigation-stack'
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'
import { Vibration } from 'react-native'
import { PASSCODE_KEY } from '@constants/async-storage'
import { SETTINGS_SCREEN } from '@constants/screens'
import { PasscodeKeyboard } from '@components/passcode/passcode-keyboard'

type Props = NavigationStackScreenProps
type State = typeof initialState

const initialState = Object.freeze({
  error: undefined as string | undefined,
  isPasscodeConfirmation: false,
  passcode: [] as number[],
  passcodeConfirmation: [] as number[],
  shouldAnimateError: false,
})

class TurnOnPasscodeScreen extends React.Component<Props, State> {
  static navigationOptions: NavigationStackOptions = {
    title: 'Turn on passcode',
  }

  readonly state = initialState

  handlePasscodeEntered = async (passcode: number[]) => {
    const { isPasscodeConfirmation } = this.state
    if (isPasscodeConfirmation) {
      const isPasscodesMatch =
        new Set(passcode.filter(el => this.state.passcode.includes(el)))
          .size === 4
      if (isPasscodesMatch) {
        const passcodeAsString = passcode.map(Number).join('')
        try {
          await RNSecureStorage.set(PASSCODE_KEY, passcodeAsString, {
            accessible: ACCESSIBLE.WHEN_UNLOCKED,
          })
          const navAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: SETTINGS_SCREEN }),
            ],
          })
          this.props.navigation.dispatch(navAction)
        } catch (error) {
          this.setState({
            error:
              'An error occured while turning on passcode, please try again.',
            isPasscodeConfirmation: false,
            passcode: [],
            passcodeConfirmation: [],
          })
        }
      } else {
        Vibration.vibrate(0, false)
        this.setState(
          {
            error: 'Passcodes mismatch, try again.',
            isPasscodeConfirmation: false,
            passcode: [],
            passcodeConfirmation: [],
            shouldAnimateError: true,
          },
          () => {
            this.setState({ shouldAnimateError: false })
          }
        )
      }
    } else {
      this.setState({
        error: undefined,
        isPasscodeConfirmation: true,
        passcode,
        passcodeConfirmation: [],
      })
    }
  }

  render() {
    const { isPasscodeConfirmation } = this.state
    return (
      <PasscodeKeyboard
        message={
          this.state.error !== undefined
            ? this.state.error
            : isPasscodeConfirmation
            ? 'Confirm passcode'
            : 'Enter a passcode'
        }
        onPasscodeEntered={this.handlePasscodeEntered}
        shouldAnimateError={this.state.shouldAnimateError}
      />
    )
  }
}

export { TurnOnPasscodeScreen }
