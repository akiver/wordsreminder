import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityIndicator } from '../activity-indicator';

describe('ActivityIndicator', () => {
  it('should match snapshot', () => {
    const tree = render(<ActivityIndicator />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
