import React from 'react'
import { render } from 'react-native-testing-library'
import { APP_STACK, AUTH_STACK } from '@constants/screens'
import { AuthLoadingScreen } from '../auth-loading-screen'

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

const navigate = jest.fn()
const navigation: any = { navigate }

describe('AuthLoadingScreen', () => {
  beforeEach(() => {
    onAuthStateChanged.mockClear()
  })

  it('should render a loading', () => {
    const { queryByText } = render(
      <AuthLoadingScreen navigation={navigation} />
    )

    expect(queryByText(/loading.../i)).not.toBeNull()
  })

  it(`should redirect to ${APP_STACK}`, () => {
    onAuthStateChanged.mockImplementation(callback => {
      callback({ id: 'user-id' })
    })
    render(<AuthLoadingScreen navigation={navigation} />)

    expect(navigate).toHaveBeenCalledWith(APP_STACK)
  })

  it(`should redirect to ${AUTH_STACK}`, () => {
    onAuthStateChanged.mockImplementation(callback => {
      callback(null)
    })
    render(<AuthLoadingScreen navigation={navigation} />)

    expect(navigate).toHaveBeenCalledWith(AUTH_STACK)
  })
})
