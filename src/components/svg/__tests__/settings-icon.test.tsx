import React from 'react'
import { render } from 'react-native-testing-library'
import renderer from 'react-test-renderer'
import Svg from 'react-native-svg'
import { SettingsIcon } from '../settings-icon'

describe('SettingsIcon', () => {
  it('should set the opacity', () => {
    const opacity = 0.3
    const { getByType } = render(<SettingsIcon opacity={opacity} />)
    expect(getByType(Svg).props.style.opacity).toBe(opacity)
  })

  it('should match snapshot', () => {
    const tree = renderer.create(<SettingsIcon />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
