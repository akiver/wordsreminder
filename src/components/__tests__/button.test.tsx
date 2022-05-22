import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeContext, themes } from '@theme/theme-context';
import { THEME_LIGHT_VALUE, THEME_DARK_VALUE } from '@constants/async-storage';
import { Button } from '../button';

describe('Button', () => {
  const onPress = jest.fn();
  const text = 'A button';

  const createComponent = (props = {}, theme = themes[THEME_DARK_VALUE]) => {
    return (
      <ThemeContext.Provider
        value={{
          theme,
          toggleTheme: () => undefined,
        }}
      >
        <Button text={text} onPress={onPress} {...props} />
      </ThemeContext.Provider>
    );
  };

  it('should display a text', () => {
    const { queryByText } = render(createComponent());
    expect(queryByText(text)).not.toBeNull();
  });

  it('should be clickable', () => {
    const { getByA11yRole } = render(createComponent());
    const button = getByA11yRole('button');
    fireEvent.press(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render disabled', () => {
    const { getByA11yRole } = render(createComponent({ disabled: true }));
    const button = getByA11yRole('button');

    expect(button.props.style.opacity).toBe(0.3);
  });

  it('should render with dark theme', () => {
    const theme = themes[THEME_DARK_VALUE];
    const { getByA11yRole, getByText } = render(createComponent({}, theme));

    expect(getByA11yRole('button').props.style.backgroundColor).toBe(theme.primary025);
    expect(getByText(text).props.style.color).toBe(theme.primary100);
  });

  it('should render with light theme', () => {
    const theme = themes[THEME_LIGHT_VALUE];
    const { getByA11yRole, getByText } = render(createComponent({}, theme));

    expect(getByA11yRole('button').props.style.backgroundColor).toBe(theme.primary025);
    expect(getByText(text).props.style.color).toBe(theme.primary100);
  });
});
