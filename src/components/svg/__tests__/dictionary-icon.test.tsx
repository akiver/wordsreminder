import React from 'react';
import renderer from 'react-test-renderer';
import { DictionaryIcon } from '../dictionary-icon';
import { WHITE } from '@constants/colors';

describe('DictionaryIcon', () => {
  it('should match snapshot', () => {
    const tree = renderer.create(<DictionaryIcon focused={true} color={WHITE} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
