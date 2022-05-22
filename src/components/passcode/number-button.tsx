import { StyleSheet, TouchableOpacity, Animated, TouchableOpacityProps, ViewStyle } from 'react-native';
import React from 'react';
import { Text } from '@components/text';
import { useTheme } from '@theme/use-theme';

type Props = TouchableOpacityProps & {
  value: string;
  animatedBorderColor: Animated.AnimatedInterpolation;
};

export function NumberButton({ onPress, value, animatedBorderColor, ...props }: Props) {
  const theme = useTheme();

  return (
    <Animated.View
      style={{
        ...styles.view,
        backgroundColor: theme.primary025,
        borderColor: animatedBorderColor,
      }}
    >
      <TouchableOpacity onPress={onPress} style={styles.touchable} {...props}>
        <Text color="primary100" fontSize={16} fontWeight="bold">
          {value}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

type Style = {
  view: ViewStyle;
  touchable: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  view: {
    borderWidth: 2,
    borderRadius: 80,
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 80,
  },
});
