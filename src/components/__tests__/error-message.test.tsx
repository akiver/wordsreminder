import React from 'react';
import { render } from '@testing-library/react-native';
import { ErrorMessage } from '../error-message';

describe('ErrorMessage', () => {
  const message = 'A message';

  const createComponent = () => <ErrorMessage message={message} />;
  it('should display a message', async () => {
    const { findByText } = render(createComponent());

    findByText(message);
  });

  it('should match snapshot', () => {
    const tree = render(createComponent()).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
