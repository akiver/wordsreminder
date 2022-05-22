import React, { useState } from 'react';
import SecureStore, { ACCESSIBLE } from 'react-native-secure-key-store';
import { Alert } from 'react-native';
import { PASSCODE_KEY } from '@constants/async-storage';
import { PasscodeKeyboard } from '@components/passcode/passcode-keyboard';
import { useNavigation } from '@react-navigation/native';
import { SETTINGS_SCREEN, SETTINGS_TURN_ON_PASSCODE_SCREEN } from '@constants/screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '@stacks/settings-stack';

type NavigationProps = StackNavigationProp<SettingsStackParamList, typeof SETTINGS_TURN_ON_PASSCODE_SCREEN>;

type State = {
  message: string;
  isConfirmation: boolean;
  firstPasscode: number[];
  shouldAnimateError: boolean;
};

export function TurnOnPasscodeScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [state, setState] = useState<State>({
    message: 'Enter a passcode',
    isConfirmation: false,
    firstPasscode: [],
    shouldAnimateError: false,
  });

  const onPasscodeEntered = async (passcode: number[]) => {
    if (!state.isConfirmation) {
      setState({
        ...state,
        firstPasscode: passcode,
        isConfirmation: true,
        message: 'Confirm passcode',
      });
      return;
    }

    const passcodeAsString = passcode.map(Number).join('');
    const passcodesMatch = passcodeAsString === state.firstPasscode.map(Number).join('');
    if (!passcodesMatch) {
      setState({
        firstPasscode: [],
        isConfirmation: false,
        message: 'Passcodes mismatch, try again.',
        shouldAnimateError: true,
      });
      return;
    }

    try {
      await SecureStore.set(PASSCODE_KEY, passcodeAsString, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
      navigation.reset({
        index: 0,
        routes: [
          {
            name: SETTINGS_SCREEN,
          },
        ],
      });
    } catch (error) {
      Alert.alert('Error', 'An error occurred while turning on the passcode, please try again.');
      setState({
        firstPasscode: [],
        isConfirmation: false,
        message: 'Enter a passcode',
        shouldAnimateError: false,
      });
    }
  };

  const onAnimationEnd = () => {
    setState({
      ...state,
      shouldAnimateError: false,
    });
  };

  return (
    <PasscodeKeyboard
      message={state.message}
      onPasscodeEntered={onPasscodeEntered}
      onAnimationEnd={onAnimationEnd}
      shouldAnimateError={state.shouldAnimateError}
    />
  );
}
