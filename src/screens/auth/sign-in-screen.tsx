import React from 'react';
import { TextInput } from 'react-native';
import { Button } from '@components/button';
import { InputText } from '@components/input-text';
import { signIn } from '@services/sign-in';
import { STATUS_LOADING, STATUS_IDLE, STATUS_ERROR, STATUS } from '@constants/statuses';
import { AUTH_SIGN_UP_SCREEN } from '@constants/screens';
import { isStringEmpty } from '@utils/is-string-empty';
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
import { RouteProp } from '@react-navigation/native';

type SignInScreenNavigationProps = StackNavigationProp<AuthStackParamList, 'auth.signin'>;
type SignInScreenRouteProps = RouteProp<AuthStackParamList, 'auth.signin'>;

type Props = {
  navigation: SignInScreenNavigationProps;
  route: SignInScreenRouteProps;
};

type State = typeof initialState;

const initialState = Object.freeze({
  status: STATUS_IDLE as STATUS,
  email: '',
  password: '',
  error: undefined as string | undefined,
});

export class SignInScreen extends React.Component<Props, State> {
  readonly state = initialState;

  passwordRef: React.RefObject<TextInput> = React.createRef();

  handleEmailChange = (email: string) => {
    this.setState({
      email,
    });
  };

  handlePasswordChange = (password: string) => {
    this.setState({
      password,
    });
  };

  submitSignIn = () => {
    this.setState(
      {
        status: STATUS_LOADING,
      },
      async () => {
        try {
          const { email, password } = this.state;
          await signIn(email, password);
        } catch (error) {
          this.setState({
            status: STATUS_ERROR,
            error: error.message,
          });
        }
      }
    );
  };

  handleSignUpPress = () => {
    this.props.navigation.push(AUTH_SIGN_UP_SCREEN);
  };

  handleEmailSubmitEditing = () => {
    if (this.passwordRef.current !== null) {
      this.passwordRef.current.focus();
    }
  };

  isSignInButtonDisabled() {
    const { email, password } = this.state;
    return isStringEmpty(email) || isStringEmpty(password);
  }

  render() {
    return (
      <AuthLayout
        status={this.state.status}
        error={this.state.error}
        testID={SIGNIN_SCREEN}
        inputs={
          <>
            <InputText
              label="Email"
              testID={SIGNIN_INPUT_EMAIL}
              placeholder="Email"
              onChangeText={this.handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              value={this.state.email}
              autoFocus={true}
              returnKeyType="next"
              onSubmitEditing={this.handleEmailSubmitEditing}
            />
            <Spacer marginTop={10}>
              <InputText
                label="Password"
                testID={SIGNIN_INPUT_PASSWORD}
                ref={this.passwordRef}
                placeholder="Password"
                onChangeText={this.handlePasswordChange}
                value={this.state.password}
                secureTextEntry={true}
                returnKeyType="send"
                onSubmitEditing={this.submitSignIn}
              />
            </Spacer>
          </>
        }
        link={
          <Text fontSize={16} onPress={this.handleSignUpPress} testID={SIGNIN_LINK_SIGNUP}>
            Sign up
          </Text>
        }
        submitButton={
          <Button
            testID={SIGNIN_SUBMIT_BUTTON}
            onPress={this.submitSignIn}
            text="Sign in"
            disabled={this.isSignInButtonDisabled()}
          />
        }
      />
    );
  }
}
