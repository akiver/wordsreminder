import React from 'react'
import { TouchableOpacity } from 'react-native'
import { render, fireEvent } from 'react-native-testing-library'
import { ThemeContext, themes } from '@contexts/theme-context'
import { THEME_LIGHT_VALUE, THEME_DARK_VALUE } from '@constants/async-storage'
import { Button } from '../button'

describe('Button', () => {
  const text = 'A button'

  it('should render', () => {
    const onPress = jest.fn()
    const { getByType, queryByText } = render(
      <Button text={text} onPress={onPress} />
    )

    const button = getByType(TouchableOpacity)
    fireEvent.press(button)

    expect(queryByText(text)).not.toBeNull()
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should render disabled', () => {
    const { getByType } = render(<Button text={text} disabled={true} />)
    const button = getByType(TouchableOpacity)
    expect(button.props.style.opacity).toBe(0.3)
  })

  it('should render with dark theme', () => {
    const theme = themes[THEME_DARK_VALUE]
    const component = (
      <ThemeContext.Provider
        value={{
          theme,
          // tslint:disable-next-line
          toggleTheme: () => {},
        }}
      >
        <Button text={text} />
      </ThemeContext.Provider>
    )
    const { getByText, getByType } = render(component)
    expect(getByType(TouchableOpacity).props.style.backgroundColor).toBe(
      theme.primary025
    )
    expect(getByText(text).props.style.color).toBe(theme.primary100)
  })

  it('should render with light theme', () => {
    const theme = themes[THEME_LIGHT_VALUE]
    const component = (
      <ThemeContext.Provider
        value={{
          theme,
          // tslint:disable-next-line
          toggleTheme: () => {},
        }}
      >
        <Button text={text} />
      </ThemeContext.Provider>
    )
    const { getByText, getByType } = render(component)

    expect(getByType(TouchableOpacity).props.style.backgroundColor).toBe(
      theme.primary025
    )
    expect(getByText(text).props.style.color).toBe(theme.primary100)
  })
})
