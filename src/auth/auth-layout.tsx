import React, { ReactChild } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Platform, ViewStyle } from 'react-native';
import { STATUS_ERROR, STATUS_LOADING, STATUS } from '@constants/statuses';
import { ErrorMessage } from '@components/error-message';
import { Spacer } from '@components/spacer';
import { ActivityIndicator } from '@components/activity-indicator';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTheme } from '@theme/use-theme';

type Props = {
  status: STATUS;
  error?: string;
  submitButton: ReactChild;
  inputs: ReactChild;
  link: ReactChild;
  testID?: string;
  children?: never;
};

export function AuthLayout({ status, error, submitButton, inputs, link, testID }: Props) {
  const headerHeight = useHeaderHeight();
  const theme = useTheme();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.primary100 }]}
      keyboardVerticalOffset={headerHeight + 10}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content} testID={testID}>
        <View style={styles.inputs}>
          {status === STATUS_LOADING && <ActivityIndicator />}
          {inputs}
          {status === STATUS_ERROR && error !== undefined && (
            <Spacer marginTop={20}>
              <ErrorMessage message={error} />
            </Spacer>
          )}
        </View>
        <View style={styles.buttons}>
          {link}
          <Spacer marginLeft={10}>{submitButton}</Spacer>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

type Style = {
  container: ViewStyle;
  content: ViewStyle;
  inputs: ViewStyle;
  buttons: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  inputs: {
    flex: 1,
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
