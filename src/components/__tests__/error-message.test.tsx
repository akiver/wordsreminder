import React from 'react';
import { render } from 'react-native-testing-library';
import renderer from 'react-test-renderer';
import { ErrorMessage } from '../error-message';

describe('ErrorMessage', () => {
  const message = 'A message';

  const createComponent = () => <ErrorMessage message={message} />;
  it('should display a message', async () => {
    const { findByText } = render(createComponent());

    findByText(message);
  });

  it('should match snapshot', () => {
    const tree = renderer.create(createComponent()).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
