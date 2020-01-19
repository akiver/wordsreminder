import React, { useState } from 'react'
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'
import { Vibration } from 'react-native'
import { PASSCODE_KEY } from '@constants/async-storage'
import { PasscodeKeyboard } from '@components/passcode/passcode-keyboard'
import { useNavigation } from '@react-navigation/native'
import { SETTINGS_SCREEN, SETTINGS_TURN_ON_PASSCODE_SCREEN } from '@constants/screens'
import { StackNavigationProp } from '@react-navigation/stack'
import { SettingsStackParamList } from '@stacks/settings-stack'

type State = {
  error: string | undefined
  isPasscodeConfirmation: boolean
  passcode: number[]
  passcodeConfirmation: number[]
  shouldAnimateError: boolean
}

export const TurnOnPasscodeScreen = () => {
  const navigation = useNavigation<
    StackNavigationProp<SettingsStackParamList, typeof SETTINGS_TURN_ON_PASSCODE_SCREEN>
  >()
  const [state, setState] = useState<State>({
    error: undefined,
    isPasscodeConfirmation: false,
    passcode: [],
    passcodeConfirmation: [],
    shouldAnimateError: false,
  })

  const { isPasscodeConfirmation } = state
  return (
    <PasscodeKeyboard
      message={
        state.error !== undefined ? state.error : isPasscodeConfirmation ? 'Confirm passcode' : 'Enter a passcode'
      }
      onPasscodeEntered={async (passcode: number[]) => {
        const { isPasscodeConfirmation } = state
        if (isPasscodeConfirmation) {
          const isPasscodesMatch = new Set(passcode.filter(el => state.passcode.includes(el))).size === 4
          if (isPasscodesMatch) {
            const passcodeAsString = passcode.map(Number).join('')
            try {
              await RNSecureStorage.set(PASSCODE_KEY, passcodeAsString, {
                accessible: ACCESSIBLE.WHEN_UNLOCKED,
              })
              navigation.reset({
                index: 0,
                routeNames: [],
                routes: [],
              })
              navigation.navigate(SETTINGS_SCREEN)
            } catch (error) {
              setState({
                ...state,
                error: 'An error occurred while turning on passcode, please try again.',
                isPasscodeConfirmation: false,
                passcode: [],
                passcodeConfirmation: [],
              })
            }
          } else {
            Vibration.vibrate(0, false)
            setState({
              error: 'Passcodes mismatch, try again.',
              isPasscodeConfirmation: false,
              passcode: [],
              passcodeConfirmation: [],
              shouldAnimateError: true,
            })
          }
        } else {
          setState({
            ...state,
            error: undefined,
            isPasscodeConfirmation: true,
            passcode,
            passcodeConfirmation: [],
          })
        }
      }}
      shouldAnimateError={state.shouldAnimateError}
    />
  )
}
