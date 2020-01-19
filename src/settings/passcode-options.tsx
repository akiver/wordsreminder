import React, { useEffect, useState } from 'react';
import RNSecureStorage from 'rn-secure-storage';
import { Button } from '@components/button';
import { PASSCODE_KEY } from '@constants/async-storage';
import { SETTINGS_TURN_ON_PASSCODE_SCREEN, SETTINGS_TURN_OFF_PASSCODE_SCREEN } from '@constants/screens';
import { Spacer } from '@components/spacer';
import { useNavigation } from '@react-navigation/native';

export const SettingsPasscodeOptions = () => {
  const navigation = useNavigation();
  const [isPasscodeStatusDetected, setIsPasscodeStatusDetected] = useState(false);
  const [isPasscodeEnabled, setIsPasscodeEnabled] = useState(false);

  useEffect(() => {
    const detectPasscodeEnabled = async () => {
      try {
        const storedPasscodeAsString = await RNSecureStorage.get(PASSCODE_KEY);
        const isPasscodeEnabled = storedPasscodeAsString !== null;
        setIsPasscodeEnabled(isPasscodeEnabled);
        setIsPasscodeStatusDetected(true);
      } catch (error) {
        if (error.code === '404' || error.code === 'EUNSPECIFIED') {
          setIsPasscodeEnabled(false);
          setIsPasscodeStatusDetected(true);
        }

        // Error reading secured storage, don't show passcode options.
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
};
