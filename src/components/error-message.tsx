import React from 'react'
import { Text } from '@components/text'
import { ERROR_MESSAGE } from '@e2e/ids'

type Props = {
  message: string
  children?: never
}

const ErrorMessage = ({ message }: Props) => (
  <Text testID={ERROR_MESSAGE} color="danger" fontSize={20}>
    {message}
  </Text>
)

export { ErrorMessage }
