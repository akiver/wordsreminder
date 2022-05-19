import React from 'react';
import { render } from '@testing-library/react-native';
import { DictionaryIcon } from '../dictionary-icon';
import { WHITE } from '@constants/colors';

describe('DictionaryIcon', () => {
  it('should match snapshot', () => {
    const tree = render(<DictionaryIcon focused={true} color={WHITE} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
