import React from 'react';
import { render } from '@testing-library/react-native';
import { PlusIcon } from '../plus-icon';

describe('PlusIcon', () => {
  it('should match snapshot', () => {
    const tree = render(<PlusIcon />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
