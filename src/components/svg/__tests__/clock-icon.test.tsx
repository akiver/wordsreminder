import React from 'react';
import { render } from '@testing-library/react-native';
import { ClockIcon } from '../clock-icon';

describe('ClockIcon', () => {
  it('should match snapshot', () => {
    const tree = render(<ClockIcon />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
