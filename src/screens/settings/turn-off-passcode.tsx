import React, { useEffect, useState } from 'react';
import { Alert, Vibration } from 'react-native';
import RNSecureStorage from 'rn-secure-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { STATUS_IDLE, STATUS_ERROR, STATUS } from '@constants/statuses';
import { PASSCODE_KEY } from '@constants/async-storage';
import { signOut } from '@services/sign-out';
import { AUTH_LOADING_SCREEN, SETTINGS_SCREEN, SETTINGS_TURN_OFF_PASSCODE_SCREEN } from '@constants/screens';
import { PasscodeKeyboard } from '@components/passcode/passcode-keyboard';
import { SettingsStackParamList } from '@stacks/settings-stack';

type State = {
  status: STATUS;
  error: string | undefined;
  currentPasscode: string;
  attemptCount: number;
  shouldAnimateError: boolean;
};

export const TurnOffPasscodeScreen = () => {
  const navigation = useNavigation<
    StackNavigationProp<SettingsStackParamList, typeof SETTINGS_TURN_OFF_PASSCODE_SCREEN>
  >();
  const [state, setState] = useState<State>({
    attemptCount: 0,
    currentPasscode: '',
    error: undefined,
    shouldAnimateError: false,
    status: STATUS_IDLE,
  });

  useEffect(() => {
    const loadPasscode = async () => {
      try {
        const currentPasscode = await RNSecureStorage.get(PASSCODE_KEY);
        if (currentPasscode !== null) {
          setState({
            ...state,
            currentPasscode,
          });
        }
      } catch (error) {
        navigation.goBack();
        Alert.alert('Error', 'An error occurred, please try again.');
      }
    };

    loadPasscode();
  }, []);

  const { error } = state;
  return (
    <PasscodeKeyboard
      message={error !== undefined ? error : 'Enter your passcode'}
      onPasscodeEntered={async (passcode: number[]) => {
        const { currentPasscode } = state;
        if (currentPasscode === passcode.map(Number).join('')) {
          try {
            await RNSecureStorage.remove(PASSCODE_KEY);
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
              ...state,
              shouldAnimateError: false,
              status: STATUS_ERROR,
              error: 'An error occurred while turning off the passcode, please try again.',
              attemptCount: 0,
            });
          }

          return;
        }

        Vibration.vibrate(0, false);
        if (state.attemptCount === 4) {
          await signOut();
          navigation.navigate(AUTH_LOADING_SCREEN);
          return;
        }

        const { attemptCount } = state;
        setState({
          ...state,
          status: STATUS_ERROR,
          error: `${attemptCount + 1} failed passcode attempts.`,
          attemptCount: attemptCount + 1,
          shouldAnimateError: true,
        });
      }}
      shouldAnimateError={state.shouldAnimateError}
    />
  );
};
