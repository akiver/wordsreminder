import React from 'react'
import renderer from 'react-test-renderer'
import { CorrectIcon } from '../correct-icon'

describe('CorrectIcon', () => {
  it('should match snapshot', () => {
    const tree = renderer.create(<CorrectIcon />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
