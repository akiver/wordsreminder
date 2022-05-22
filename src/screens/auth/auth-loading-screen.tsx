import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Text } from '@components/text';
import { MainView } from '@components/main-view';
import { AuthStack } from '@stacks/auth-stack';
import { TabsStack } from '@stacks/tabs-stack';

export function AuthLoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
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
}

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
