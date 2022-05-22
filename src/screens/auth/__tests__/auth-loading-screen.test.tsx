import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthLoadingScreen } from '../auth-loading-screen';
import { Text } from 'react-native';

jest.mock('@stacks/tabs-stack', () => {
  return {
    TabsStack: () => <Text>Tabs stack</Text>,
  };
});

jest.mock('@stacks/auth-stack', () => {
  return {
    AuthStack: () => <Text>Auth stack</Text>,
  };
});

const onAuthStateChanged = jest.fn();
jest.mock('@react-native-firebase/auth', () => {
  return () => {
    return {
      onAuthStateChanged,
    };
  };
});

describe('AuthLoadingScreen', () => {
  beforeEach(() => {
    onAuthStateChanged.mockClear();
  });

  it('should render a loading', () => {
    const { queryByText } = render(<AuthLoadingScreen />);

    expect(queryByText(/loading.../i)).not.toBeNull();
  });

  it('should render tabs stack', async () => {
    onAuthStateChanged.mockImplementation((callback) => {
      callback({ id: 'user-id' });
    });
    const { queryByText } = render(<AuthLoadingScreen />);

    expect(queryByText('Tabs stack')).toBeDefined();
  });

  it('should render auth stack', async () => {
    onAuthStateChanged.mockImplementation((callback) => {
      callback(null);
    });
    const { queryByText } = render(<AuthLoadingScreen />);

    expect(queryByText('Auth stack')).toBeDefined();
  });
});
