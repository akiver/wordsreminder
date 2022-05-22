import React from 'react';
import { TouchableHighlight } from 'react-native';
import { LeftArrowIcon } from '@components/svg/left-arrow-icon';
import { FILTER_CLOSE_BUTTON } from '@e2e/ids';

type Props = {
  onPress: () => void;
};

export function FilterCloseButton({ onPress }: Props) {
  return (
    <TouchableHighlight onPress={onPress} testID={FILTER_CLOSE_BUTTON}>
      <LeftArrowIcon />
    </TouchableHighlight>
  );
}
