import React from 'react'
import renderer from 'react-test-renderer'
import { PlusIcon } from '../plus-icon'

describe('PlusIcon', () => {
  it('should match snapshot', () => {
    const tree = renderer.create(<PlusIcon />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
