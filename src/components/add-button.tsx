import React from 'react';
import { StyleSheet, TouchableHighlight, ViewStyle } from 'react-native';
import { PlusIcon } from '@components/svg/plus-icon';

type Props = {
  onPress: () => void;
  testID?: string;
};

export function AddButton({ onPress, testID }: Props) {
  return (
    <TouchableHighlight
      style={styles.addButton}
      onPress={onPress}
      underlayColor="transparent"
      accessibilityRole="link"
      testID={testID}
    >
      <PlusIcon />
    </TouchableHighlight>
  );
}

type Style = {
  addButton: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
