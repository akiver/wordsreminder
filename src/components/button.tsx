import { StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import React from 'react';
import { Text } from '@components/text';
import { useTheme } from '@theme/use-theme';

type Props = TouchableOpacityProps & {
  text: string;
};

export function Button({ onPress, text, ...props }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.container,
        backgroundColor: theme.primary025,
        ...(props.disabled && styles.disabled),
      }}
      {...props}
      accessibilityRole="button"
    >
      <Text color="primary100" fontSize={16} fontWeight="bold">
        {text}
      </Text>
    </TouchableOpacity>
  );
}

type Style = {
  container: ViewStyle;
  disabled: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  disabled: {
    opacity: 0.3,
  },
});
