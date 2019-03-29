import React from 'react'
import { TouchableHighlight } from 'react-native'
import { render, fireEvent, shallow } from 'react-native-testing-library'
import { AddButton } from '../add-button'

describe('AddButton', () => {
  it('should render', () => {
    const onPress = jest.fn()
    const { getByType } = render(<AddButton onPress={onPress} />)

    const button = getByType(TouchableHighlight)
    fireEvent.press(button)

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should match snapshot', () => {
    const onPress = () => undefined
    const { output } = shallow(<AddButton onPress={onPress} />)
    expect(output).toMatchSnapshot()
  })
})
