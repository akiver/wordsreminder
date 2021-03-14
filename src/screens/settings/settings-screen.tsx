import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { STATUS_IDLE, STATUS_ERROR, STATUS_LOADING, STATUS } from '@constants/statuses';
import { MainView } from '@components/main-view';
import { Button } from '@components/button';
import { ErrorMessage } from '@components/error-message';
import { signOut } from '@services/sign-out';
import { Spacer } from '@components/spacer';
import { Text } from '@components/text';
import { ThemeContext, themes, Theme } from '@contexts/theme-context';
import { THEME_KEY, THEME_LIGHT_VALUE, THEME_DARK_VALUE } from '@constants/async-storage';
import { ActivityIndicator } from '@components/activity-indicator';
import { SETTINGS_THEME_BUTTON, SETTINGS_SIGNOUT_BUTTON, SETTINGS_SCREEN_ID } from '@e2e/ids';
import { SettingsPasscodeOptions } from '@settings/passcode-options';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SettingsStackParamList } from '@stacks/settings-stack';
import { SETTINGS_SCREEN } from '@constants/screens';

type SettingsScreenNavigationProps = StackNavigationProp<SettingsStackParamList, typeof SETTINGS_SCREEN>;
type SettingsScreenRouteProps = RouteProp<SettingsStackParamList, typeof SETTINGS_SCREEN>;

type Props = {
  navigation: SettingsScreenNavigationProps;
  route: SettingsScreenRouteProps;
};
type State = typeof initialState;

const initialState = Object.freeze({
  status: STATUS_IDLE as STATUS,
  error: undefined as string | undefined,
});

export class SettingsScreen extends React.Component<Props, State> {
  readonly state = initialState;

  handleThemePress = (toggleTheme: () => void, theme: Theme) => async () => {
    this.setState(
      {
        status: STATUS_LOADING,
      },
      async () => {
        try {
          await AsyncStorage.setItem(
            THEME_KEY,
            theme === themes[THEME_DARK_VALUE] ? THEME_LIGHT_VALUE : THEME_DARK_VALUE
          );

          toggleTheme();

          this.setState({
            status: STATUS_IDLE,
          });
        } catch (error) {
          this.setState({
            status: STATUS_ERROR,
            error: error.message,
          });
        }
      }
    );
  };

  handleSignOutPress = () => {
    this.setState(
      {
        status: STATUS_LOADING,
      },
      async () => {
        try {
          await signOut();
        } catch (error) {
          this.setState({
            status: STATUS_ERROR,
            error: error.message,
          });
        }
      }
    );
  };

  renderLoading() {
    if (this.state.status === STATUS_LOADING) {
      return <ActivityIndicator size="large" />;
    }

    return null;
  }

  renderError() {
    if (this.state.status === STATUS_ERROR && this.state.error !== undefined) {
      return (
        <Spacer marginTop={20}>
          <ErrorMessage message={this.state.error} />
        </Spacer>
      );
    }

    return null;
  }

  render() {
    const user = auth().currentUser;

    return (
      <MainView testID={SETTINGS_SCREEN_ID}>
        <View style={styles.view}>
          {this.renderLoading()}
          <SettingsPasscodeOptions />
          <ThemeContext.Consumer>
            {({ theme, toggleTheme }) => {
              const themeValue = theme === themes.dark ? 'light' : 'dark';
              return (
                <Button
                  onPress={this.handleThemePress(toggleTheme, theme)}
                  text={`Use ${themeValue} theme`}
                  testID={SETTINGS_THEME_BUTTON}
                />
              );
            }}
          </ThemeContext.Consumer>
          <Spacer marginTop={30}>
            {user !== null && user.email !== null && (
              <Spacer marginBottom={10}>
                <Text style={styles.email} fontSize={20}>
                  {user.email}
                </Text>
              </Spacer>
            )}
            <Button onPress={this.handleSignOutPress} text="Sign out" testID={SETTINGS_SIGNOUT_BUTTON} />
          </Spacer>
          {this.renderError()}
        </View>
      </MainView>
    );
  }
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
