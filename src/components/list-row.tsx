import React, { ReactNode } from 'react';
import { StyleSheet, TouchableHighlight, ViewStyle } from 'react-native';
import { useTheme } from '@theme/use-theme';

type Props = {
  onPress?: () => void;
  testID: string;
  children: ReactNode;
};

export function ListRow({ onPress, testID, children }: Props) {
  const theme = useTheme();

  return (
    <TouchableHighlight
      underlayColor={theme.primary075}
      style={[
        styles.container,
        {
          backgroundColor: theme.primary100,
          borderBottomColor: theme.primary025,
        },
      ]}
      onPress={onPress}
      testID={testID}
    >
      {children}
    </TouchableHighlight>
  );
}

type Style = {
  container: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 10,
  },
});
