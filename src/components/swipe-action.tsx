import React from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { DANGER, INFO } from '@constants/colors';
import { Text } from '@components/text';

type Props = {
  progress: Animated.AnimatedInterpolation;
  dragX: number;
  text: string;
  backgroundColor: typeof DANGER | typeof INFO;
  onPress: () => void;
  testID: string;
};

export function SwipeAction({ progress, dragX, text, backgroundColor, onPress, testID }: Props) {
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [dragX, 0],
  });

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
      <RectButton style={[styles.action, { backgroundColor }]} onPress={onPress} testID={testID}>
        <Text color="white" fontSize={16}>
          {text}
        </Text>
      </RectButton>
    </Animated.View>
  );
}

type Style = {
  action: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  action: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
