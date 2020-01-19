import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { auth } from 'react-native-firebase';
import { Text } from '@components/text';
import { MainView } from '@components/main-view';
import { AuthStack } from '@stacks/auth-stack';
import { TabsStack } from '@stacks/tabs-stack';

export const AuthLoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<object | null>(null);

  useEffect(() => {
    auth().onAuthStateChanged((user: object | null) => {
      setUser(user);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <MainView>
        <View style={styles.container}>
          <Text fontSize={38}>Loading...</Text>
        </View>
      </MainView>
    );
  }

  if (user === null) {
    return <AuthStack />;
  }

  return <TabsStack />;
};

type Style = {
  container: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
