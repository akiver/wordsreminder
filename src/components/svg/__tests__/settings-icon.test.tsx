import React from 'react';
import renderer from 'react-test-renderer';
import { SettingsIcon } from '../settings-icon';
import { WHITE } from '@constants/colors';

describe('SettingsIcon', () => {
  it('should match snapshot', () => {
    const tree = renderer.create(<SettingsIcon focused={true} color={WHITE} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
