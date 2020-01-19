import React from 'react'
import { View, StyleSheet, Animated, ViewStyle } from 'react-native'
import { MainView } from '@components/main-view'
import { Spacer } from '@components/spacer'
import { NumberButton } from '@components/passcode/number-button'
import { Indicator } from '@components/passcode/indicator'
import { DeleteButton } from '@components/passcode/delete-button'
import { ThemeContext, Theme } from '@contexts/theme-context'

const initialState = Object.freeze({
  passcode: [] as number[],
})

type Props = {
  message: string
  shouldAnimateError: boolean
  onPasscodeEntered: (passcode: number[]) => void | Promise<void>
}
type State = typeof initialState

export class PasscodeKeyboard extends React.Component<Props, State> {
  static contextType = ThemeContext

  readonly state = initialState

  animatedColor = new Animated.Value(0)

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { shouldAnimateError } = nextProps
    if (shouldAnimateError) {
      Animated.timing(this.animatedColor, {
        toValue: 1,
        duration: 500,
      }).start(() => {
        this.animatedColor.setValue(0)
      })
    }

    return (
      shouldAnimateError ||
      nextProps.message !== this.props.message ||
      nextState.passcode.length !== this.state.passcode.length
    )
  }

  handleNumberPress = (value: number) => () => {
    this.setState(
      ({ passcode }) => ({ passcode: [...passcode, value] }),
      () => {
        const { passcode } = this.state
        if (passcode.length === 4) {
          this.setState({
            passcode: [],
          })
          this.props.onPasscodeEntered(passcode)
        }
      }
    )
  }

  handleDeletePress = () => {
    this.setState(({ passcode }) => {
      if (passcode.length === 0) {
        return { passcode }
      }
      return {
        passcode: passcode.slice(0, -1),
      }
    })
  }

  render() {
    const { passcode } = this.state
    const theme: Theme = this.context.theme
    const color = this.animatedColor.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.primary025, theme.danger],
    })

    return (
      <MainView>
        <View style={styles.container}>
          <Animated.Text style={{ color, fontSize: 18 }}>{this.props.message}</Animated.Text>
          <Spacer marginTop={20}>
            <View style={styles.row}>
              {Array.from(Array(4), (v, index) => index + 1).map(indicatorNumber => {
                return (
                  <Spacer key={`indicator-${indicatorNumber}`} marginLeft={indicatorNumber === 1 ? 0 : 5}>
                    <Indicator isFilled={passcode.length >= indicatorNumber} borderInterpolation={color} />
                  </Spacer>
                )
              })}
            </View>
          </Spacer>
          <Spacer marginTop={20}>
            <View style={styles.row}>
              <NumberButton value="1" onPress={this.handleNumberPress(1)} animatedBorderColor={color} />
              <Spacer marginLeft={10}>
                <NumberButton value="2" onPress={this.handleNumberPress(2)} animatedBorderColor={color} />
              </Spacer>
              <Spacer marginLeft={10}>
                <NumberButton value="3" onPress={this.handleNumberPress(3)} animatedBorderColor={color} />
              </Spacer>
            </View>
            <Spacer marginTop={10}>
              <View style={styles.row}>
                <NumberButton value="4" onPress={this.handleNumberPress(4)} animatedBorderColor={color} />
                <Spacer marginLeft={10}>
                  <NumberButton value="5" onPress={this.handleNumberPress(5)} animatedBorderColor={color} />
                </Spacer>
                <Spacer marginLeft={10}>
                  <NumberButton value="6" onPress={this.handleNumberPress(6)} animatedBorderColor={color} />
                </Spacer>
              </View>
            </Spacer>
            <Spacer marginTop={10}>
              <View style={styles.row}>
                <NumberButton value="7" onPress={this.handleNumberPress(7)} animatedBorderColor={color} />
                <Spacer marginLeft={10}>
                  <NumberButton value="8" onPress={this.handleNumberPress(8)} animatedBorderColor={color} />
                </Spacer>
                <Spacer marginLeft={10}>
                  <NumberButton value="9" onPress={this.handleNumberPress(9)} animatedBorderColor={color} />
                </Spacer>
              </View>
            </Spacer>
            <Spacer marginTop={10}>
              <View style={[styles.row, { justifyContent: 'flex-end' }]}>
                <NumberButton value="0" onPress={this.handleNumberPress(0)} animatedBorderColor={color} />
                <Spacer marginLeft={10}>
                  <DeleteButton onPress={this.handleDeletePress} />
                </Spacer>
              </View>
            </Spacer>
          </Spacer>
        </View>
      </MainView>
    )
  }
}

type Style = {
  container: ViewStyle
  row: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
})
