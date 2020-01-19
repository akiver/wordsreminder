import React from 'react'
import { render, waitForElement } from '@testing-library/react-native'
import { AuthLoadingScreen } from '../auth-loading-screen'
import { Text } from 'react-native'

jest.mock('@stacks/tabs-stack', () => {
  return {
    TabsStack: () => <Text>Tabs stack</Text>, // eslint-disable-line
  }
})

jest.mock('@stacks/auth-stack', () => {
  return {
    AuthStack: () => <Text>Auth stack</Text>, // eslint-disable-line
  }
})

const onAuthStateChanged = jest.fn()
jest.mock('react-native-firebase', () => {
  return {
    auth: () => {
      return {
        onAuthStateChanged,
      }
    },
  }
})

describe('AuthLoadingScreen', () => {
  beforeEach(() => {
    onAuthStateChanged.mockClear()
  })

  it('should render a loading', () => {
    const { queryByText } = render(<AuthLoadingScreen />)

    expect(queryByText(/loading.../i)).not.toBeNull()
  })

  it('should render tabs stack', async () => {
    onAuthStateChanged.mockImplementation(callback => {
      callback({ id: 'user-id' })
    })
    const { findByText } = render(<AuthLoadingScreen />)

    await waitForElement(() => findByText('Tabs stack'))
  })

  it('should render auth stack', async () => {
    onAuthStateChanged.mockImplementation(callback => {
      callback(null)
    })
    const { findByText } = render(<AuthLoadingScreen />)

    await waitForElement(() => findByText('Auth stack'))
  })
})
