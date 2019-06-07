import React from 'react'
import renderer from 'react-test-renderer'
import { SettingsIcon } from '../settings-icon'

describe('SettingsIcon', () => {
  it('should match snapshot', () => {
    const tree = renderer.create(<SettingsIcon opacity={0.3} />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
