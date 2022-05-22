import React, { useState } from 'react';
import { Alert } from 'react-native';
import SecureStore from 'react-native-secure-key-store';
import { PASSCODE_KEY } from '@constants/async-storage';
import { PasscodeKeyboard } from '@components/passcode/passcode-keyboard';
import { AUTH_LOADING_SCREEN, PASSCODE_STACK } from '@constants/screens';
import { signOut } from '@services/sign-out';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@stacks/root-stack';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<RootStackParamList, typeof PASSCODE_STACK>;

type Props = {
  currentPasscode: string;
};

export function EnterPasscode({ currentPasscode }: Props) {
  const navigation = useNavigation<NavigationProps>();
  const [attemptCount, setAttemptCount] = useState(0);
  const [shouldAnimateError, setShouldAnimateError] = useState(false);

  const onPassCodeEntered = async (passcode: number[]) => {
    const isPasscodeCorrect = currentPasscode === passcode.map(Number).join('');
    if (isPasscodeCorrect) {
      navigation.replace(AUTH_LOADING_SCREEN);
      return;
    }

    setShouldAnimateError(true);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    const maxAttempts = 4;
    if (newAttemptCount === maxAttempts) {
      try {
        await signOut();
        await SecureStore.remove(PASSCODE_KEY);
        navigation.replace(AUTH_LOADING_SCREEN);
      } catch (error) {
        Alert.alert('Error', 'An error occurred.');
      }
    }
  };

  const onAnimationEnd = () => {
    setShouldAnimateError(false);
  };

  return (
    <PasscodeKeyboard
      shouldAnimateError={shouldAnimateError}
      onPasscodeEntered={onPassCodeEntered}
      onAnimationEnd={onAnimationEnd}
      message="Enter passcode"
    />
  );
}
