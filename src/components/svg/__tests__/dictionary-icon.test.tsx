import React from 'react'
import renderer from 'react-test-renderer'
import { DictionaryIcon } from '../dictionary-icon'

describe('DictionaryIcon', () => {
  it('should match snapshot', () => {
    const tree = renderer.create(<DictionaryIcon opacity={0.3} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
