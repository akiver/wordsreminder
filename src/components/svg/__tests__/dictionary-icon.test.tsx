import React from 'react'
import { render } from 'react-native-testing-library'
import renderer from 'react-test-renderer'
import Svg from 'react-native-svg'
import { DictionaryIcon } from '../dictionary-icon'

describe('DictionaryIcon', () => {
  it('should set the opacity', () => {
    const opacity = 0.3
    const { getByType } = render(<DictionaryIcon opacity={opacity} />)
    expect(getByType(Svg).props.style.opacity).toBe(opacity)
  })

  it('should match snapshot', () => {
    const tree = renderer.create(<DictionaryIcon />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
