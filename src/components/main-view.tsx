import React, { ReactNode } from 'react';
import { StyleSheet, SafeAreaView, ViewStyle } from 'react-native';
import { ThemeContext } from '@contexts/theme-context';

type Props = {
  children: ReactNode;
  testID?: string;
};

export const MainView = ({ testID, children }: Props) => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.primary100 }]} testID={testID}>
          {children}
        </SafeAreaView>
      )}
    </ThemeContext.Consumer>
  );
};

type Style = {
  container: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
  },
});
