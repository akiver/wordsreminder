import React from 'react';
import SecureStore from 'react-native-secure-key-store';
import { Alert, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import TouchID from 'react-native-touch-id';
import { PASSCODE_KEY } from '@constants/async-storage';
import { signOut } from '@services/sign-out';
import { EnterPasscode } from '@components/enter-passcode';
import { AUTH_LOADING_SCREEN, PASS_CODE_STACK } from '@constants/screens';
import { ThemeContext } from '@contexts/theme-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@stacks/root-stack';
import { RouteProp } from '@react-navigation/native';
import { isSecureStorageError } from '@utils/is-secure-storage-error';
import { isAuthenticationError } from '@utils/is-authentication-error';

const initialState = Object.freeze({
  isLocked: false,
  passcode: '',
});

type LockerScreenNavigationProps = StackNavigationProp<RootStackParamList, typeof PASS_CODE_STACK>;
type LockerScreenRouteProps = RouteProp<RootStackParamList, typeof PASS_CODE_STACK>;

type Props = {
  navigation: LockerScreenNavigationProps;
  route: LockerScreenRouteProps;
};

type State = typeof initialState;

export class LockerScreen extends React.Component<Props, State> {
  readonly state = initialState;

  async componentDidMount() {
    try {
      const passcode = await SecureStore.get(PASSCODE_KEY);
      // Passcode integrity invalid, logout and remove the passcode.
      if (passcode === null) {
        await this.invalidatePasscode();
        this.navigateToAuthScreen();
        return;
      }
      this.setState({
        passcode,
      });
    } catch (error) {
      // Key not found in storage, just navigate to the auth loading screen.
      if (isSecureStorageError(error) && (error.code === '404' || error.code === 'EUNSPECIFIED')) {
        this.navigateToAuthScreen();
        return;
      }

      // Error reading secured device storage, logout, remove the passcode and show the screen to signin.
      await this.invalidatePasscode();
      this.navigateToAuthScreen();
      return;
    }

    try {
      const type = await TouchID.isSupported();
      try {
        const message = type === 'FaceID' ? 'Unlock with your face' : 'Unlock with your fingerprint';
        await TouchID.authenticate(message);
      } catch (error) {
        if (!isAuthenticationError(error)) {
          await this.invalidatePasscode();
          return;
        }

        switch (error.name) {
          case 'LAErrorUserFallback':
          case 'LAErrorUserCancel': // User pressed "Cancel" or "Use password".
            if (auth().currentUser !== null) {
              this.setState({ isLocked: true });
              return;
            }
            break;
          case 'LAErrorTouchIDNotEnrolled': // TouchID / FaceID not enrolled on the device, ask to enable it.
            if (auth().currentUser !== null) {
              this.setState({ isLocked: true });
              Alert.alert('Error', `${type} not enrolled, please enable it from settings.`);
              return;
            }
            break;
          case 'LAErrorTouchIDNotAvailable': // Current app not allowed to use TouchID from settings, ask to enable it.
            if (auth().currentUser !== null) {
              this.setState({ isLocked: true });
              Alert.alert('Error', `WordsReminder is not allowed to use ${type}, please enable it from settings`);
              return;
            }
            break;
        }
      }
    } catch (error) {
      // TouchID / FaceID not supported, show the passcode screen if the user is logged.
      if (auth().currentUser !== null) {
        this.setState({ isLocked: true });
        return;
      }
    }

    this.navigateToAuthScreen();
  }

  async invalidatePasscode() {
    await signOut();
    await SecureStore.remove(PASSCODE_KEY);
  }

  navigateToAuthScreen = () => {
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: AUTH_LOADING_SCREEN }],
    });
  };

  handlePasscodeCorrect = () => {
    this.navigateToAuthScreen();
  };

  render() {
    const { isLocked } = this.state;
    if (isLocked) {
      return (
        <EnterPasscode
          navigation={this.props.navigation}
          onPasscodeCorrect={this.handlePasscodeCorrect}
          currentPasscode={this.state.passcode}
        />
      );
    }

    return (
      <ThemeContext.Consumer>
        {({ theme }) => {
          return <View style={{ flex: 1, backgroundColor: theme.primary100 }} />;
        }}
      </ThemeContext.Consumer>
    );
  }
}
