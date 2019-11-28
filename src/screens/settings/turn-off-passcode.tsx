import React from 'react'
import { Alert, Vibration } from 'react-native'
import RNSecureStorage from 'rn-secure-storage'
import { StackActions, NavigationActions } from 'react-navigation'
import { NavigationStackScreenProps, NavigationStackOptions } from 'react-navigation-stack'
import { STATUS_IDLE, STATUS_ERROR, STATUS } from '@constants/statuses'
import { PASSCODE_KEY } from '@constants/async-storage'
import { signOut } from '@services/sign-out'
import { AUTH_LOADING_SCREEN, SETTINGS_SCREEN } from '@constants/screens'
import { PasscodeKeyboard } from '@components/passcode/passcode-keyboard'

type Props = NavigationStackScreenProps
type State = typeof initialState

const initialState = Object.freeze({
  status: STATUS_IDLE as STATUS,
  error: undefined as string | undefined,
  currentPasscode: '',
  attemptCount: 0,
  shouldAnimateError: false,
})

class TurnOffPasscodeScreen extends React.Component<Props, State> {
  static navigationOptions: NavigationStackOptions = {
    title: 'Turn off passcode',
  }

  readonly state = initialState

  async componentDidMount() {
    try {
      const currentPasscode = await RNSecureStorage.get(PASSCODE_KEY)
      if (currentPasscode !== null) {
        this.setState({
          currentPasscode,
        })
      }
    } catch (error) {
      this.props.navigation.pop()
      Alert.alert('Error', 'An error occured, please try again.')
    }
  }

  handlePasscodeEntered = async (passcode: number[]) => {
    const { currentPasscode } = this.state
    if (currentPasscode === passcode.map(Number).join('')) {
      try {
        await RNSecureStorage.remove(PASSCODE_KEY)
        const navAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: SETTINGS_SCREEN })],
        })
        this.props.navigation.dispatch(navAction)
      } catch (error) {
        this.setState({
          status: STATUS_ERROR,
          error: 'An error occured while turning off the passcode, please try again.',
          attemptCount: 0,
        })
      }

      return
    }

    Vibration.vibrate(0, false)
    if (this.state.attemptCount === 4) {
      await signOut()
      this.props.navigation.navigate(AUTH_LOADING_SCREEN)
      return
    }

    this.setState(
      ({ attemptCount }) => {
        return {
          status: STATUS_ERROR,
          error: `${attemptCount + 1} failed passcode attempts.`,
          attemptCount: attemptCount + 1,
          shouldAnimateError: true,
        }
      },
      () => {
        this.setState({ shouldAnimateError: false })
      }
    )
  }

  render() {
    const { error } = this.state
    return (
      <PasscodeKeyboard
        message={error !== undefined ? error : 'Enter your passcode'}
        onPasscodeEntered={this.handlePasscodeEntered}
        shouldAnimateError={this.state.shouldAnimateError}
      />
    )
  }
}

export { TurnOffPasscodeScreen }
