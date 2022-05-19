import React from 'react';
import { render } from '@testing-library/react-native';
import { STATUS_IDLE, STATUS_ERROR, STATUS, STATUS_LOADING } from '@constants/statuses';
import { AuthLayout } from '../auth-layout';

jest.mock('@react-navigation/elements', () => {
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

  it('should display inputs', () => {
    const { queryByText } = render(createComponent());
    expect(queryByText('Inputs')).toBeDefined();
  });

  it('should display a link', () => {
    const { queryByText } = render(createComponent());
    expect(queryByText('Link')).toBeDefined();
  });

  it('should display a submit button', () => {
    const { queryByText } = render(createComponent());
    expect(queryByText('Submit')).toBeDefined();
  });

  describe('when an error occurred', () => {
    it('should display the error', () => {
      const { rerender, queryByText } = render(createComponent());
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
      const { rerender, getByA11yHint } = render(createComponent());
      rerender(
        createComponent({
          status: STATUS_LOADING,
        })
      );

      expect(getByA11yHint('Loading')).toBeDefined();
    });
  });
});
