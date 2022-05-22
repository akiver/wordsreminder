import React from 'react';
import { ActivityIndicator as RNActivityIndicator, StyleSheet, ActivityIndicatorProps, ViewStyle } from 'react-native';
import { useTheme } from '@theme/use-theme';

type Props = ActivityIndicatorProps;

export function ActivityIndicator({ size = 'small' }: Props) {
  const theme = useTheme();

  return (
    <RNActivityIndicator
      color={theme.primary025}
      size={size}
      style={styles.activityIndicator}
      accessibilityHint="Loading"
    />
  );
}

type Style = {
  activityIndicator: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  activityIndicator: {
    padding: 10,
  },
});
