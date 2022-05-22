import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  width: number;
  children: ReactNode;
};

export function SwipeActions({ width, children }: Props) {
  return <View style={[styles.actions, { width }]}>{children}</View>;
}

type Style = {
  actions: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  actions: { flexDirection: 'row' },
});
