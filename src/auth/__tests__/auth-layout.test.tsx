import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { render } from 'react-native-testing-library'
import { Header } from 'react-navigation'
import {
  STATUS_IDLE,
  STATUS_ERROR,
  STATUS,
  STATUS_LOADING,
} from '@constants/statuses'
import { ActivityIndicator } from '@components/activity-indicator'
import { AuthLayout } from '../auth-layout'

describe('AuthLayout', () => {
  const Link = <>Link</>
  const Inputs = <>Inputs</>
  const SubmitButton = <>Submit</>

  const renderComponent = (props?: { status: STATUS; error?: string }) => {
    return render(
      <AuthLayout
        link={Link}
        inputs={Inputs}
        submitButton={SubmitButton}
        status={STATUS_IDLE}
        {...props}
      />
    )
  }

  it('should display inputs', async () => {
    const { queryByType } = renderComponent()

    expect(queryByType(() => Inputs)).toBeDefined()
  })

  it('should display a link', async () => {
    const { queryByType } = renderComponent()

    expect(queryByType(() => Link)).toBeDefined()
  })

  it('should display a submit button', async () => {
    const { queryByType } = renderComponent()

    expect(queryByType(() => SubmitButton)).toBeDefined()
  })

  describe('with an error', () => {
    it('should display the error', () => {
      const { queryByText } = renderComponent({
        status: STATUS_ERROR,
        error: 'An error',
      })

      expect(queryByText('An error')).toBeDefined()
    })
  })

  describe('while loading', () => {
    it('should display an activity indicator', () => {
      const { queryByType } = renderComponent({
        status: STATUS_LOADING,
      })

      expect(queryByType(ActivityIndicator)).toBeDefined()
    })
  })

  describe('KeyboardAvoidingView', () => {
    it('should have the right vertical offset', () => {
      Object.defineProperty(Header, 'HEIGHT', {
        get: jest.fn(() => 10),
      })
      const { getByType } = renderComponent()
      const offset = getByType(KeyboardAvoidingView).props
        .keyboardVerticalOffset

      expect(offset).toBe(20)
    })

    describe('iOS', () => {
      it('should have a behavior prop', () => {
        Platform.OS = 'ios'
        const { getByType } = renderComponent()

        expect(getByType(KeyboardAvoidingView).props.behavior).toBe('padding')
      })
    })

    describe('Android', () => {
      it('should not have a behavior prop', () => {
        Platform.OS = 'android'
        const { getByType } = renderComponent()

        expect(getByType(KeyboardAvoidingView).props.behavior).toBeUndefined()
      })
    })
  })
})
