import React, { ReactNode } from 'react';
import { StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { STATUS, STATUS_ERROR } from '@constants/statuses';
import { ErrorMessage } from '@components/error-message';
import { Spacer } from '@components/spacer';
import { MainView } from '@components/main-view';

type Props = {
  status: STATUS;
  error?: string;
  children: ReactNode;
};

export function FormLayout({ status, error, children }: Props) {
  return (
    <MainView>
      <ScrollView style={styles.scrollView}>
        {status === STATUS_ERROR && error !== undefined && (
          <Spacer marginBottom={10} marginTop={10}>
            <ErrorMessage message={error} />
          </Spacer>
        )}
        {children}
      </ScrollView>
    </MainView>
  );
}

type Style = {
  scrollView: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  scrollView: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
});
