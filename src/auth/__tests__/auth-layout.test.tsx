import React from 'react';
import { render } from '@testing-library/react-native';
import { STATUS_IDLE, STATUS_ERROR, STATUS, STATUS_LOADING } from '@constants/statuses';
import { AuthLayout } from '../auth-layout';

jest.mock('@react-navigation/stack', () => {
  return {
    useHeaderHeight: () => {
      return 40;
    },
  };
});

describe('AuthLayout', () => {
  const Link = <>Link</>;
  const Inputs = <>Inputs</>;
  const SubmitButton = <>Submit</>;

  const createComponent = (props?: { status: STATUS; error?: string }) => {
    return <AuthLayout link={Link} inputs={Inputs} submitButton={SubmitButton} status={STATUS_IDLE} {...props} />;
  };

  const { rerender, queryByText, getByHintText } = render(createComponent());

  it('should display inputs', () => {
    expect(queryByText('Inputs')).toBeDefined();
  });

  it('should display a link', () => {
    expect(queryByText('Link')).toBeDefined();
  });

  it('should display a submit button', () => {
    expect(queryByText('Submit')).toBeDefined();
  });

  describe('when an error occured', () => {
    it('should display the error', () => {
      rerender(
        createComponent({
          status: STATUS_ERROR,
          error: 'An error',
        })
      );

      expect(queryByText('An error')).toBeDefined();
    });
  });

  describe('when loading', () => {
    it('should display a loading indicator', () => {
      rerender(
        createComponent({
          status: STATUS_LOADING,
        })
      );

      expect(getByHintText('Loading')).toBeDefined();
    });
  });
});
