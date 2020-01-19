import React, { ReactNode } from 'react';
import { StyleSheet, SafeAreaView, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/use-theme';

type Props = {
  children: ReactNode;
  testID?: string;
};

export const MainView = ({ testID, children }: Props) => {
  const theme = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.primary100 }]} testID={testID}>
      {children}
    </SafeAreaView>
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
