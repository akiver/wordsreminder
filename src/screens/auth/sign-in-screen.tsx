import React, { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { Button } from '@components/button';
import { InputText } from '@components/input-text';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '@services/sign-in';
import { STATUS_LOADING, STATUS_IDLE, STATUS_ERROR, STATUS } from '@constants/statuses';
import { AUTH_SIGN_UP_SCREEN } from '@constants/screens';
import { Spacer } from '@components/spacer';
import { AuthLayout } from '@auth/auth-layout';
import { Text } from '@components/text';
import {
  SIGNIN_SCREEN,
  SIGNIN_SUBMIT_BUTTON,
  SIGNIN_INPUT_EMAIL,
  SIGNIN_INPUT_PASSWORD,
  SIGNIN_LINK_SIGNUP,
} from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@stacks/auth-stack';
import { isStringEmpty } from '@utils/is-string-empty';

type NavigationProps = StackNavigationProp<AuthStackParamList, 'auth.signin'>;

export function SignInScreen() {
  const navigation = useNavigation<NavigationProps>();
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<STATUS>(STATUS_IDLE);
  const [error, setError] = useState<string | undefined>(undefined);

  const focusOnPasswordInput = () => {
    passwordRef.current?.focus();
  };

  const submit = async () => {
    try {
      setStatus(STATUS_LOADING);
      await signIn(email, password);
    } catch (error) {
      setStatus(STATUS_ERROR);
      setError(error instanceof Error ? error.message : 'An error occurred.');
      focusOnPasswordInput();
    }
  };

  const onEmailChange = (email: string) => {
    setEmail(email);
  };

  const onPasswordChange = (password: string) => {
    setPassword(password);
  };

  const onSignUpPress = () => {
    navigation.push(AUTH_SIGN_UP_SCREEN);
  };

  const isSignInButtonDisabled = isStringEmpty(email) || isStringEmpty(password);

  return (
    <AuthLayout
      status={status}
      error={error}
      testID={SIGNIN_SCREEN}
      inputs={
        <>
          <InputText
            label="Email"
            testID={SIGNIN_INPUT_EMAIL}
            placeholder="Email"
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            autoFocus={true}
            returnKeyType="next"
            onSubmitEditing={focusOnPasswordInput}
          />
          <Spacer marginTop={10}>
            <InputText
              ref={passwordRef}
              label="Password"
              testID={SIGNIN_INPUT_PASSWORD}
              placeholder="Password"
              onChangeText={onPasswordChange}
              value={password}
              secureTextEntry={true}
              autoCapitalize="none"
              returnKeyType="send"
              onSubmitEditing={submit}
            />
          </Spacer>
        </>
      }
      link={
        <Text fontSize={16} onPress={onSignUpPress} testID={SIGNIN_LINK_SIGNUP}>
          Sign up
        </Text>
      }
      submitButton={
        <Button testID={SIGNIN_SUBMIT_BUTTON} onPress={submit} text="Sign in" disabled={isSignInButtonDisabled} />
      }
    />
  );
}
