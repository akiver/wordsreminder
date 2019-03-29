import React from 'react'
import { render, shallow } from 'react-native-testing-library'
import { ErrorMessage } from '../error-message'

describe('ErrorMessage', () => {
  const message = 'A message'
  it('should render', async () => {
    const { queryByText } = render(<ErrorMessage message={message} />)

    expect(queryByText(message)).not.toBeNull()
  })

  it('should match snapshot', () => {
    const { output } = shallow(<ErrorMessage message={message} />)
    expect(output).toMatchSnapshot()
  })
})
