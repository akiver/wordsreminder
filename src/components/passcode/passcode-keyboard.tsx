import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, Vibration } from 'react-native';
import { MainView } from '@components/main-view';
import { Spacer } from '@components/spacer';
import { NumberButton } from '@components/passcode/number-button';
import { Indicator } from '@components/passcode/indicator';
import { DeleteButton } from '@components/passcode/delete-button';
import { useTheme } from '@theme/use-theme';

type Props = {
  message: string;
  shouldAnimateError: boolean;
  onPasscodeEntered: (passcode: number[]) => void | Promise<void>;
  onAnimationEnd: () => void;
};

export function PasscodeKeyboard({ message, onPasscodeEntered, shouldAnimateError, onAnimationEnd }: Props) {
  const animatedColor = useRef(new Animated.Value(0));
  const [passcode, setPasscode] = useState<number[]>([]);
  const theme = useTheme();

  useEffect(() => {
    if (!shouldAnimateError) {
      return;
    }

    Vibration.vibrate();
    Animated.timing(animatedColor.current, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      animatedColor.current.setValue(0);
      onAnimationEnd();
    });
  }, [shouldAnimateError, onAnimationEnd]);

  const onDeletePress = () => {
    if (passcode.length === 0) {
      return;
    }

    setPasscode(passcode.slice(0, -1));
  };

  const color = animatedColor.current.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.primary025, theme.danger],
  });

  const onNumberPress = (value: number) => () => {
    const newPasscode: number[] = [...passcode, value];
    if (newPasscode.length === 4) {
      onPasscodeEntered(newPasscode);
      setPasscode([]);
    } else {
      setPasscode(newPasscode);
    }
  };

  return (
    <MainView>
      <View style={styles.container}>
        <Animated.Text style={{ color, fontSize: 18 }}>{message}</Animated.Text>
        <Spacer marginTop={20}>
          <View style={styles.row}>
            {Array.from(Array(4), (v, index) => index + 1).map((indicatorNumber) => {
              return (
                <Spacer key={`indicator-${indicatorNumber}`} marginLeft={indicatorNumber === 1 ? 0 : 5}>
                  <Indicator isFilled={passcode.length >= indicatorNumber} borderInterpolation={color} />
                </Spacer>
              );
            })}
          </View>
        </Spacer>
        <Spacer marginTop={20}>
          <View style={styles.row}>
            <NumberButton value="1" onPress={onNumberPress(1)} animatedBorderColor={color} />
            <Spacer marginLeft={10}>
              <NumberButton value="2" onPress={onNumberPress(2)} animatedBorderColor={color} />
            </Spacer>
            <Spacer marginLeft={10}>
              <NumberButton value="3" onPress={onNumberPress(3)} animatedBorderColor={color} />
            </Spacer>
          </View>
          <Spacer marginTop={10}>
            <View style={styles.row}>
              <NumberButton value="4" onPress={onNumberPress(4)} animatedBorderColor={color} />
              <Spacer marginLeft={10}>
                <NumberButton value="5" onPress={onNumberPress(5)} animatedBorderColor={color} />
              </Spacer>
              <Spacer marginLeft={10}>
                <NumberButton value="6" onPress={onNumberPress(6)} animatedBorderColor={color} />
              </Spacer>
            </View>
          </Spacer>
          <Spacer marginTop={10}>
            <View style={styles.row}>
              <NumberButton value="7" onPress={onNumberPress(7)} animatedBorderColor={color} />
              <Spacer marginLeft={10}>
                <NumberButton value="8" onPress={onNumberPress(8)} animatedBorderColor={color} />
              </Spacer>
              <Spacer marginLeft={10}>
                <NumberButton value="9" onPress={onNumberPress(9)} animatedBorderColor={color} />
              </Spacer>
            </View>
          </Spacer>
          <Spacer marginTop={10}>
            <View style={[styles.row, { justifyContent: 'flex-end' }]}>
              <NumberButton value="0" onPress={onNumberPress(0)} animatedBorderColor={color} />
              <Spacer marginLeft={10}>
                <DeleteButton onPress={onDeletePress} />
              </Spacer>
            </View>
          </Spacer>
        </Spacer>
      </View>
    </MainView>
  );
}

type Style = {
  container: ViewStyle;
  row: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});
