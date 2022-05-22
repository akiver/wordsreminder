import React, { useEffect, useState } from 'react';
import SecureStore from 'react-native-secure-key-store';
import { Alert, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import TouchID from 'react-native-touch-id';
import { PASSCODE_KEY } from '@constants/async-storage';
import { signOut } from '@services/sign-out';
import { EnterPasscode } from '@components/enter-passcode';
import { AUTH_LOADING_SCREEN, PASSCODE_STACK } from '@constants/screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@stacks/root-stack';
import { isSecureStorageError } from '@utils/is-secure-storage-error';
import { isAuthenticationError } from '@utils/is-authentication-error';
import { useTheme } from '@theme/use-theme';

type LockScreenNavigationProps = StackNavigationProp<RootStackParamList, typeof PASSCODE_STACK>;

export function LockScreen() {
  const [passCode, setPassCode] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation<LockScreenNavigationProps>();

  useEffect(() => {
    const navigateToAuthScreen = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: AUTH_LOADING_SCREEN }],
      });
    };

    const invalidatePasscode = async () => {
      await signOut();
      await SecureStore.remove(PASSCODE_KEY);
    };

    (async () => {
      try {
        const passcode = await SecureStore.get(PASSCODE_KEY);
        // Passcode integrity invalid, logout and remove the passcode.
        if (passcode === null) {
          await invalidatePasscode();
          navigateToAuthScreen();
          return;
        }
        setPassCode(passcode);
      } catch (error) {
        // Key not found in storage, just navigate to the auth loading screen.
        if (isSecureStorageError(error) && (error.code === '404' || error.code === 'EUNSPECIFIED')) {
          navigateToAuthScreen();
          return;
        }

        // Error reading secured device storage, logout, remove the passcode and show the screen to signin.
        await invalidatePasscode();
        navigateToAuthScreen();
        return;
      }

      try {
        const type = await TouchID.isSupported();
        try {
          const message = type === 'FaceID' ? 'Unlock with your face' : 'Unlock with your fingerprint';
          await TouchID.authenticate(message);
        } catch (error) {
          if (!isAuthenticationError(error)) {
            await invalidatePasscode();
            return;
          }

          switch (error.name) {
            case 'LAErrorUserFallback':
            case 'LAErrorUserCancel': // User pressed "Cancel" or "Use password".
              if (auth().currentUser !== null) {
                setIsLocked(true);
                return;
              }
              break;
            case 'LAErrorTouchIDNotEnrolled': // TouchID / FaceID not enrolled on the device, ask to enable it.
              if (auth().currentUser !== null) {
                setIsLocked(true);
                Alert.alert('Error', `${type} not enrolled, please enable it from settings.`);
                return;
              }
              break;
            case 'LAErrorTouchIDNotAvailable': // Current app not allowed to use TouchID from settings, ask to enable it.
              if (auth().currentUser !== null) {
                setIsLocked(true);
                Alert.alert('Error', `WordsReminder is not allowed to use ${type}, please enable it from settings`);
                return;
              }
              break;
          }
        }
      } catch (error) {
        // TouchID / FaceID not supported, show the passcode screen if the user is logged.
        if (auth().currentUser !== null) {
          setIsLocked(true);
          return;
        }
      }

      navigateToAuthScreen();
    })();
  }, [navigation]);

  if (isLocked) {
    return <EnterPasscode currentPasscode={passCode} />;
  }

  return <View style={{ flex: 1, backgroundColor: theme.primary100 }} />;
}
