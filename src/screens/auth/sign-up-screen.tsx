import React from 'react';
import { TextInput } from 'react-native';
import { Button } from '@components/button';
import { InputText } from '@components/input-text';
import { STATUS_ERROR, STATUS_IDLE, STATUS_LOADING, STATUS } from '@constants/statuses';
import { signUp } from '@services/sign-up';
import { isStringEmpty } from '@utils/is-string-empty';
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
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '@stacks/auth-stack';

type SignUpScreenNavigationProps = StackNavigationProp<AuthStackParamList, 'auth.signup'>;
type SignUpScreenRouteProps = RouteProp<AuthStackParamList, 'auth.signup'>;

type Props = {
  navigation: SignUpScreenNavigationProps;
  route: SignUpScreenRouteProps;
};
type State = typeof initialState;

const initialState = Object.freeze({
  status: STATUS_IDLE as STATUS,
  email: '',
  password: '',
  error: undefined,
});

export class SignUpScreen extends React.Component<Props, State> {
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

  submitSignUp = () => {
    this.setState(
      {
        status: STATUS_LOADING,
      },
      async () => {
        try {
          const { email, password } = this.state;
          await signUp(email, password);
        } catch (error) {
          this.setState({
            status: STATUS_ERROR,
            error: error.message,
          });
        }
      }
    );
  };

  handleSignInPress = () => {
    this.props.navigation.goBack();
  };

  handleEmailSubmitEditing = () => {
    if (this.passwordRef.current !== null) {
      this.passwordRef.current.focus();
    }
  };

  isCreateButtonDisabled() {
    const { email, password } = this.state;
    return isStringEmpty(email) || isStringEmpty(password);
  }

  render() {
    return (
      <AuthLayout
        status={this.state.status}
        error={this.state.error}
        testID={SIGNUP_SCREEN}
        inputs={
          <>
            <InputText
              label="Email"
              placeholder="Email"
              onChangeText={this.handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              value={this.state.email}
              autoFocus={true}
              returnKeyType="next"
              onSubmitEditing={this.handleEmailSubmitEditing}
              testID={SIGNUP_INPUT_EMAIL}
            />
            <Spacer marginTop={10}>
              <InputText
                label="Password"
                ref={this.passwordRef}
                placeholder="Password"
                onChangeText={this.handlePasswordChange}
                value={this.state.password}
                secureTextEntry={true}
                returnKeyType="send"
                onSubmitEditing={this.submitSignUp}
                testID={SIGNUP_INPUT_PASSWORD}
              />
            </Spacer>
          </>
        }
        link={
          <Text fontSize={16} onPress={this.handleSignInPress} testID={SIGNUP_LINK_SIGNIN}>
            Sign in
          </Text>
        }
        submitButton={
          <Button
            onPress={this.submitSignUp}
            text="Create user"
            disabled={this.isCreateButtonDisabled()}
            testID={SIGNUP_SUBMIT_BUTTON}
          />
        }
      />
    );
  }
}
