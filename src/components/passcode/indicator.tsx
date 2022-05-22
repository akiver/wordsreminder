import { StyleSheet, Animated, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@theme/use-theme';

type Props = {
  isFilled: boolean;
  borderInterpolation?: Animated.AnimatedInterpolation;
};

export function Indicator({ isFilled, borderInterpolation, ...props }: Props) {
  const theme = useTheme();

  return (
    <Animated.View
      style={{
        ...styles.container,
        backgroundColor: isFilled ? theme.primary025 : theme.primary100,
        borderWidth: 2,
        borderColor: borderInterpolation || theme.primary025,
      }}
      {...props}
    />
  );
}

type Style = {
  container: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    height: 20,
    width: 20,
    borderRadius: 20,
  },
});
