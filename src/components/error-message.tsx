import React from 'react';
import { Text } from '@components/text';
import { ERROR_MESSAGE } from '@e2e/ids';

type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props) {
  return (
    <Text testID={ERROR_MESSAGE} color="danger" fontSize={20}>
      {message}
    </Text>
  );
}
