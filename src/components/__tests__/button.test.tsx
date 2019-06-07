import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeContext, themes } from '@contexts/theme-context'
import { THEME_LIGHT_VALUE, THEME_DARK_VALUE } from '@constants/async-storage'
import { Button } from '../button'

describe('Button', () => {
  const onPress = jest.fn()
  const text = 'A button'

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
    )
  }

  const { rerender, queryByText, getByRole, getByText } = render(
    createComponent()
  )

  it('should display a text', () => {
    expect(queryByText(text)).not.toBeNull()
  })

  it('should be clickable', () => {
    const button = getByRole('button')
    fireEvent.press(button)

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should render disabled', () => {
    rerender(createComponent({ disabled: true }))
    const button = getByRole('button')

    expect(button.props.style.opacity).toBe(0.3)
  })

  it('should render with dark theme', () => {
    const theme = themes[THEME_DARK_VALUE]
    rerender(createComponent({}, theme))

    expect(getByRole('button').props.style.backgroundColor).toBe(
      theme.primary025
    )
    expect(getByText(text).props.style.color).toBe(theme.primary100)
  })

  it('should render with light theme', () => {
    const theme = themes[THEME_LIGHT_VALUE]
    rerender(createComponent({}, theme))

    expect(getByRole('button').props.style.backgroundColor).toBe(
      theme.primary025
    )
    expect(getByText(text).props.style.color).toBe(theme.primary100)
  })
})
