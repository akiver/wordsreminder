import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { useTheme } from '@theme/use-theme';

export function ClockIcon() {
  const theme = useTheme();

  return (
    <Svg width={16} height={16} viewBox="0 0 97.16 97.16" testID="clock-icon">
      <G fill={theme.primary050}>
        <Path d="M48.58 0C21.793 0 0 21.793 0 48.58s21.793 48.58 48.58 48.58 48.58-21.793 48.58-48.58S75.367 0 48.58 0zm0 86.823c-21.087 0-38.244-17.155-38.244-38.243S27.493 10.337 48.58 10.337 86.824 27.492 86.824 48.58 69.667 86.823 48.58 86.823z" />
        <Path d="M73.898 47.08H52.066V20.83a4 4 0 0 0-8 0v30.25a4 4 0 0 0 4 4h25.832a4 4 0 0 0 0-8z" />
      </G>
    </Svg>
  );
}
