import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddButton } from '../add-button';

describe('AddButton', () => {
  it('should render clickable add button', () => {
    const onPress = jest.fn();
    const { getByA11yRole } = render(<AddButton onPress={onPress} />);

    const link = getByA11yRole('link');
    fireEvent.press(link);

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
