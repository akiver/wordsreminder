import React from 'react';
import { ActivityIndicator, TouchableHighlight } from 'react-native';
import { STATUS, STATUS_LOADING } from '@constants/statuses';
import { CorrectIcon } from '@components/svg/correct-icon';
import { Spacer } from '@components/spacer';
import { SAVE_BUTTON } from '@e2e/ids';
import { useTheme } from '@hooks/use-theme';

type Props = {
  status: STATUS;
  onPress: () => void;
  disabled: boolean;
};

export const SaveButton = ({ status, onPress, disabled = false }: Props) => {
  const theme = useTheme();
  if (status === STATUS_LOADING) {
    return (
      <Spacer marginRight={10}>
        <ActivityIndicator size="large" color={theme.primary025} />
      </Spacer>
    );
  }

  return (
    <Spacer marginRight={10}>
      <TouchableHighlight
        onPress={onPress}
        disabled={disabled}
        style={{ opacity: disabled ? 0.5 : 1 }}
        testID={SAVE_BUTTON}
      >
        <CorrectIcon />
      </TouchableHighlight>
    </Spacer>
  );
};
