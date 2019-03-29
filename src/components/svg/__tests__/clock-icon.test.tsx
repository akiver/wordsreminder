import React from 'react'
import renderer from 'react-test-renderer'
import { ClockIcon } from '../clock-icon'

describe('ClockIcon', () => {
  it('should match snapshot', () => {
    const tree = renderer.create(<ClockIcon />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
