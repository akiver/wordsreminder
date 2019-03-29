import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { auth } from 'react-native-firebase'
import { APP_STACK, AUTH_STACK } from '@constants/screens'
import { Text } from '@components/text'
import { MainView } from '@components/main-view'
import { NavigationScreenProps } from 'react-navigation'

class AuthLoadingScreen extends React.Component<NavigationScreenProps> {
  componentDidMount() {
    auth().onAuthStateChanged(this.handleAuthStateChanged)
  }

  handleAuthStateChanged = (user: object | null) => {
    const { navigation } = this.props
    if (user !== null) {
      navigation.navigate(APP_STACK)
    } else {
      navigation.navigate(AUTH_STACK)
    }
  }

  render() {
    return (
      <MainView>
        <View style={styles.container}>
          <Text fontSize={38}>Loading...</Text>
        </View>
      </MainView>
    )
  }
}

type Style = {
  container: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export { AuthLoadingScreen }
