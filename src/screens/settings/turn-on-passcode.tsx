import React, { useState } from 'react';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import { Vibration } from 'react-native';
import { PASSCODE_KEY } from '@constants/async-storage';
import { PasscodeKeyboard } from '@components/passcode/passcode-keyboard';
import { useNavigation } from '@react-navigation/native';
import { SETTINGS_SCREEN, SETTINGS_TURN_ON_PASSCODE_SCREEN } from '@constants/screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { SettingsStackParamList } from '@stacks/settings-stack';

type State = {
  error: string | undefined;
  isPasscodeConfirmation: boolean;
  passcode: number[];
  shouldAnimateError: boolean;
};

export const TurnOnPasscodeScreen = () => {
  const navigation = useNavigation<
    StackNavigationProp<SettingsStackParamList, typeof SETTINGS_TURN_ON_PASSCODE_SCREEN>
  >();
  const [state, setState] = useState<State>({
    error: undefined,
    isPasscodeConfirmation: false,
    passcode: [],
    shouldAnimateError: false,
  });

  const { isPasscodeConfirmation } = state;
  return (
    <PasscodeKeyboard
      message={
        state.error !== undefined ? state.error : isPasscodeConfirmation ? 'Confirm passcode' : 'Enter a passcode'
      }
      onPasscodeEntered={async (passcode: number[]) => {
        const { isPasscodeConfirmation } = state;
        if (isPasscodeConfirmation) {
          const passcodeAsString = passcode.map(Number).join('');
          const passcodesMatch = passcodeAsString === state.passcode.map(Number).join('');
          if (passcodesMatch) {
            try {
              await RNSecureStorage.set(PASSCODE_KEY, passcodeAsString, {
                accessible: ACCESSIBLE.WHEN_UNLOCKED,
              });
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: SETTINGS_SCREEN,
                    },
                  ],
                })
              );
            } catch (error) {
              setState({
                shouldAnimateError: false,
                error: 'An error occurred while turning on passcode, please try again.',
                isPasscodeConfirmation: false,
                passcode: [],
              });
            }
          } else {
            Vibration.vibrate(0, false);
            setState({
              error: 'Passcodes mismatch, try again.',
              isPasscodeConfirmation: false,
              passcode: [],
              shouldAnimateError: true,
            });
          }
        } else {
          setState({
            shouldAnimateError: false,
            error: undefined,
            isPasscodeConfirmation: true,
            passcode,
          });
        }
      }}
      shouldAnimateError={state.shouldAnimateError}
    />
  );
};
