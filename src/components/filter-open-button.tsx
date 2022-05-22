import React from 'react';
import { TouchableHighlight } from 'react-native';
import { Spacer } from '@components/spacer';
import { FilterIcon } from '@components/svg/filter-icon';
import { FILTER_OPEN_BUTTON } from '@e2e/ids';

type Props = {
  onPress: () => void;
};

export function FilterOpenButton({ onPress }: Props) {
  return (
    <Spacer marginRight={20}>
      <TouchableHighlight onPress={onPress} testID={FILTER_OPEN_BUTTON}>
        <FilterIcon />
      </TouchableHighlight>
    </Spacer>
  );
}
