import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import SecureStore from 'react-native-secure-key-store';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { PASSCODE_KEY } from '@constants/async-storage';
import { signOut } from '@services/sign-out';
import { AUTH_LOADING_SCREEN, SETTINGS_SCREEN, SETTINGS_TURN_OFF_PASSCODE_SCREEN } from '@constants/screens';
import { PasscodeKeyboard } from '@components/passcode/passcode-keyboard';
import { SettingsStackParamList } from '@stacks/settings-stack';

type NavigationProps = StackNavigationProp<SettingsStackParamList, typeof SETTINGS_TURN_OFF_PASSCODE_SCREEN>;

export function TurnOffPasscodeScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [shouldAnimateError, setShouldAnimateError] = useState(false);
  const [message, setMessage] = useState('Enter your passcode');
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    const loadPasscode = async () => {
      try {
        const passcode = await SecureStore.get(PASSCODE_KEY);
        if (passcode !== null) {
          setCurrentPasscode(passcode);
        }
      } catch (error) {
        navigation.goBack();
        Alert.alert('Error', 'An error occurred, please try again.');
      }
    };

    loadPasscode();
  }, [navigation]);

  const onPasscodeEntered = async (passcode: number[]) => {
    const isPasscodeCorrect = currentPasscode === passcode.map(Number).join('');
    if (isPasscodeCorrect) {
      try {
        await SecureStore.remove(PASSCODE_KEY);
        navigation.reset({
          index: 0,
          routes: [
            {
              name: SETTINGS_SCREEN,
            },
          ],
        });
      } catch (error) {
        Alert.alert('Error', 'An error occurred while turning off the passcode, please try again.');
        navigation.goBack();
      }
      return;
    }

    const newAttemptCount = attemptCount + 1;
    const maxAttempts = 4;
    setAttemptCount(newAttemptCount);
    if (newAttemptCount === maxAttempts) {
      await signOut();
      navigation.reset({
        index: 0,
        routes: [
          {
            name: AUTH_LOADING_SCREEN,
          },
        ],
      });
      return;
    }

    setShouldAnimateError(true);
    setMessage(`${newAttemptCount}/${maxAttempts} failed passcode attempts.`);
  };

  const onAnimationEnd = () => {
    setShouldAnimateError(false);
  };

  return (
    <PasscodeKeyboard
      message={message}
      onPasscodeEntered={onPasscodeEntered}
      onAnimationEnd={onAnimationEnd}
      shouldAnimateError={shouldAnimateError}
    />
  );
}
