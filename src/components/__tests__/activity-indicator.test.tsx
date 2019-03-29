import React from 'react'
import renderer from 'react-test-renderer'
import { ActivityIndicator } from '../activity-indicator'

describe('ActivityIndicator', () => {
  it('should match snapshot', () => {
    const tree = renderer.create(<ActivityIndicator />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
