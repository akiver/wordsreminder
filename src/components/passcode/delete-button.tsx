import { StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import React from 'react';
import { Text } from '@components/text';
import { useTheme } from '@theme/use-theme';

type Props = TouchableOpacityProps;

export function DeleteButton({ onPress, ...props }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.container,
        backgroundColor: theme.primary100,
        borderColor: theme.primary025,
      }}
      {...props}
    >
      <Text color="primary025" fontSize={16} fontWeight="bold">
        Delete
      </Text>
    </TouchableOpacity>
  );
}

type Style = {
  container: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    height: 80,
    width: 80,
    borderRadius: 80,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
