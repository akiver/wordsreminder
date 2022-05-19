import React from 'react';
import { render } from '@testing-library/react-native';
import { SettingsIcon } from '../settings-icon';
import { WHITE } from '@constants/colors';

describe('SettingsIcon', () => {
  it('should match snapshot', () => {
    const tree = render(<SettingsIcon focused={true} color={WHITE} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
