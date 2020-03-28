import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddButton } from '../add-button';

describe('AddButton', () => {
  const onPress = jest.fn();
  const { getByRole, findByTestId } = render(<AddButton onPress={onPress} />);

  it('should render a plus icon', () => {
    findByTestId('plus-icon');
  });

  // https://github.com/testing-library/native-testing-library/issues/113
  it.skip('should be clickable', () => {
    const link = getByRole('link');
    fireEvent.press(link);

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
