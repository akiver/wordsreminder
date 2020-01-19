import React from 'react';
import RNSecureStorage from 'rn-secure-storage';
import { Alert, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import TouchID from 'react-native-touch-id';
import { PASSCODE_KEY } from '@constants/async-storage';
import { signOut } from '@services/sign-out';
import { EnterPasscode } from '@components/enter-passcode';
import { AUTH_LOADING_SCREEN } from '@constants/screens';
import { ThemeContext } from '@contexts/theme-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@stacks/root-stack';
import { RouteProp } from '@react-navigation/native';

const initialState = Object.freeze({
  isLocked: false,
  passcode: '',
});

type LockerScreenNavigationProps = StackNavigationProp<RootStackParamList, 'app-locker-screen'>;
type LockerScreenRouteProps = RouteProp<RootStackParamList, 'app-locker-screen'>;

type Props = {
  navigation: LockerScreenNavigationProps;
  route: LockerScreenRouteProps;
};

type State = typeof initialState;

export class LockerScreen extends React.Component<Props, State> {
  readonly state = initialState;

  async componentDidMount() {
    try {
      const passcode = await RNSecureStorage.get(PASSCODE_KEY);
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
      if (error.code === '404' || error.code === 'EUNSPECIFIED') {
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
        // User pressed "Cancel" or "Use password".
        if (
          error.code === 'AUTHENTICATION_CANCELED' ||
          error.name === 'LAErrorUserFallback' ||
          error.name === 'LAErrorUserCancel'
        ) {
          // User logged, show the passcode input "keyboard".
          if (auth().currentUser !== null) {
            this.setState({ isLocked: true });
            return;
          }

          // User not logged, redirect to the auth logic handling.
          this.navigateToAuthScreen();
          return;
        }

        // TouchID / FaceID not enrolled on the device, ask to enable it.
        if (error.name === 'LAErrorTouchIDNotEnrolled') {
          if (auth().currentUser !== null) {
            this.setState({ isLocked: true });
            Alert.alert('Error', `${type} not enrolled, please enable it from settings.`);
            return;
          }

          this.navigateToAuthScreen();
          return;
        }

        // Current app not allowed to use TouchID from settings, ask to enable it.
        if (error.name === 'LAErrorTouchIDNotAvailable') {
          if (auth().currentUser !== null) {
            this.setState({ isLocked: true });
            Alert.alert('Error', `WordsReminder is not allowed to use ${type}, please enable it from settings`);
            return;
          }

          this.navigateToAuthScreen();
          return;
        }

        // In all others cases invalid the passcode.
        await this.invalidatePasscode();
      }
    } catch (error) {
      // TouchID / FaceID not supported, show the passcode screen if the user is logged.
      // NOT_AVAILABLE is thrown on Android when fingerprint is not available.
      if (auth().currentUser !== null || error.code === 'NOT_AVAILABLE') {
        this.setState({ isLocked: true });
        return;
      }
    }

    this.navigateToAuthScreen();
  }

  async invalidatePasscode() {
    await signOut();
    await RNSecureStorage.remove(PASSCODE_KEY);
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
