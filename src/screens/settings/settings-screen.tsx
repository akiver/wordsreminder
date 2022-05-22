import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import auth from '@react-native-firebase/auth';
import { STATUS_IDLE, STATUS_ERROR, STATUS_LOADING, STATUS } from '@constants/statuses';
import { MainView } from '@components/main-view';
import { Button } from '@components/button';
import { ErrorMessage } from '@components/error-message';
import { signOut } from '@services/sign-out';
import { Spacer } from '@components/spacer';
import { Text } from '@components/text';
import { themes } from '@theme/theme-context';
import { ActivityIndicator } from '@components/activity-indicator';
import { SETTINGS_THEME_BUTTON, SETTINGS_SIGNOUT_BUTTON, SETTINGS_SCREEN_ID } from '@e2e/ids';
import { SettingsPasscodeOptions } from '@settings/passcode-options';
import { useToggleTheme } from '@theme/use-toggle-theme';
import { useTheme } from '@theme/use-theme';

export function SettingsScreen() {
  const [status, setStatus] = useState<STATUS>(STATUS_IDLE);
  const [error, setError] = useState('');
  const toggleTheme = useToggleTheme();
  const theme = useTheme();

  const onToggleThemePress = async () => {
    try {
      setStatus(STATUS_LOADING);
      await toggleTheme();
      setStatus(STATUS_IDLE);
    } catch (error) {
      setStatus(STATUS_ERROR);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const onSignOutPress = async () => {
    try {
      setStatus(STATUS_LOADING);
      await signOut();
    } catch (error) {
      setStatus(STATUS_ERROR);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const renderUser = () => {
    const user = auth().currentUser;
    if (user === null || user.email === null) {
      return null;
    }

    return (
      <Spacer marginBottom={10}>
        <Text style={styles.email} fontSize={20}>
          {user.email}
        </Text>
      </Spacer>
    );
  };

  const renderError = () => {
    if (status !== STATUS_ERROR) {
      null;
    }

    return (
      <Spacer marginTop={20}>
        <ErrorMessage message={error} />
      </Spacer>
    );
  };

  const themeName = theme === themes.dark ? 'light' : 'dark';

  return (
    <MainView testID={SETTINGS_SCREEN_ID}>
      <View style={styles.view}>
        {status === STATUS_LOADING && <ActivityIndicator size="large" />}
        <SettingsPasscodeOptions />
        <Button onPress={onToggleThemePress} text={`Use ${themeName} theme`} testID={SETTINGS_THEME_BUTTON} />
        <Spacer marginTop={30}>
          {renderUser()}
          <Button onPress={onSignOutPress} text="Sign out" testID={SETTINGS_SIGNOUT_BUTTON} />
        </Spacer>
        {renderError()}
      </View>
    </MainView>
  );
}

type Style = {
  view: ViewStyle;
  email: TextStyle;
};

const styles = StyleSheet.create<Style>({
  view: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  email: {
    textAlign: 'center',
  },
});
