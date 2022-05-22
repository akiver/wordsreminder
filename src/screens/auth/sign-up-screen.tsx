import React, { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { Button } from '@components/button';
import { InputText } from '@components/input-text';
import { STATUS_ERROR, STATUS_IDLE, STATUS_LOADING, STATUS } from '@constants/statuses';
import { signUp } from '@services/sign-up';
import { Spacer } from '@components/spacer';
import { AuthLayout } from '@auth/auth-layout';
import { Text } from '@components/text';
import {
  SIGNUP_SCREEN,
  SIGNUP_INPUT_EMAIL,
  SIGNUP_INPUT_PASSWORD,
  SIGNUP_LINK_SIGNIN,
  SIGNUP_SUBMIT_BUTTON,
} from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@stacks/auth-stack';
import { isStringEmpty } from '@utils/is-string-empty';

type NavigationProps = StackNavigationProp<AuthStackParamList, 'auth.signup'>;

export function SignUpScreen() {
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
      await signUp(email, password);
    } catch (error) {
      setStatus(STATUS_ERROR);
      setError(error instanceof Error ? error.message : 'An error occurred');
      focusOnPasswordInput();
    }
  };

  const onSignInPress = () => {
    navigation.goBack();
  };

  const onEmailChange = (email: string) => {
    setEmail(email);
  };

  const onPasswordChange = (password: string) => {
    setPassword(password);
  };
  const isCreateButtonDisabled = isStringEmpty(email) || isStringEmpty(password);

  return (
    <AuthLayout
      status={status}
      error={error}
      testID={SIGNUP_SCREEN}
      inputs={
        <>
          <InputText
            label="Email"
            placeholder="Email"
            onChangeText={onEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            autoFocus={true}
            returnKeyType="next"
            onSubmitEditing={focusOnPasswordInput}
            testID={SIGNUP_INPUT_EMAIL}
          />
          <Spacer marginTop={10}>
            <InputText
              label="Password"
              ref={passwordRef}
              placeholder="Password"
              onChangeText={onPasswordChange}
              value={password}
              secureTextEntry={true}
              autoCapitalize="none"
              returnKeyType="send"
              onSubmitEditing={submit}
              testID={SIGNUP_INPUT_PASSWORD}
            />
          </Spacer>
        </>
      }
      link={
        <Text fontSize={16} onPress={onSignInPress} testID={SIGNUP_LINK_SIGNIN}>
          Sign in
        </Text>
      }
      submitButton={
        <Button onPress={submit} text="Create user" disabled={isCreateButtonDisabled} testID={SIGNUP_SUBMIT_BUTTON} />
      }
    />
  );
}
