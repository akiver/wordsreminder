import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { Theme } from '@theme/theme-context';
import { useTheme } from '@theme/use-theme';

type Props = TextProps & {
  color?: keyof Theme;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  children: string;
};

export function Text({ onPress, color = 'primary025', fontSize = 16, fontWeight, children, style, ...props }: Props) {
  const theme = useTheme();

  return (
    <RNText
      style={Object.assign(
        {
          color: theme[color],
          fontSize,
          fontWeight,
        },
        style
      )}
      onPress={onPress}
      {...props}
    >
      {children}
    </RNText>
  );
}
