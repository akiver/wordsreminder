import React from 'react';
import { render } from '@testing-library/react-native';
import { CorrectIcon } from '../correct-icon';

describe('CorrectIcon', () => {
  it('should match snapshot', () => {
    const tree = render(<CorrectIcon />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
