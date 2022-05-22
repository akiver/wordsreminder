import React, { useEffect, useState } from 'react';
import SecureStore from 'react-native-secure-key-store';
import { Button } from '@components/button';
import { PASSCODE_KEY } from '@constants/async-storage';
import { SETTINGS_TURN_ON_PASSCODE_SCREEN, SETTINGS_TURN_OFF_PASSCODE_SCREEN } from '@constants/screens';
import { Spacer } from '@components/spacer';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '@stacks/settings-stack';
import { isSecureStorageError } from '@utils/is-secure-storage-error';

export function SettingsPasscodeOptions() {
  const navigation = useNavigation<StackNavigationProp<SettingsStackParamList>>();
  const [isPasscodeStatusDetected, setIsPasscodeStatusDetected] = useState(false);
  const [isPasscodeEnabled, setIsPasscodeEnabled] = useState(false);

  useEffect(() => {
    const detectPasscodeEnabled = async () => {
      try {
        const storedPasscodeAsString = await SecureStore.get(PASSCODE_KEY);
        const isPasscodeEnabled = storedPasscodeAsString !== null;
        setIsPasscodeEnabled(isPasscodeEnabled);
      } catch (error) {
        if (isSecureStorageError(error) && (error.code === '404' || error.code === 'EUNSPECIFIED')) {
          setIsPasscodeEnabled(false);
        }

        // Error reading secured storage, don't show passcode options.
      } finally {
        setIsPasscodeStatusDetected(true);
      }
    };

    detectPasscodeEnabled();
  }, []);

  if (!isPasscodeStatusDetected) {
    return null;
  }

  let options;
  if (isPasscodeEnabled) {
    options = (
      <Button
        onPress={() => {
          navigation.navigate(SETTINGS_TURN_OFF_PASSCODE_SCREEN);
        }}
        text="Turn passcode off"
      />
    );
  } else {
    options = (
      <Button
        onPress={() => {
          navigation.navigate(SETTINGS_TURN_ON_PASSCODE_SCREEN);
        }}
        text="Turn passcode on"
      />
    );
  }

  return <Spacer marginBottom={20}>{options}</Spacer>;
}
