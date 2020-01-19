import React from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native';
import { Spacer } from '@components/spacer';
import { Text } from '@components/text';
import { useTheme } from '@hooks/use-theme';

type Props = TextInputProps & {
  label: string;
};

export const InputText = React.forwardRef<TextInput, Props>((props: Props, ref) => {
  const theme = useTheme();
  return (
    <>
      <Spacer marginBottom={5}>
        <Text fontSize={18} color="primary025" fontWeight="bold">
          {props.label}
        </Text>
      </Spacer>
      <TextInput
        ref={ref}
        style={[styles.inputText, { color: theme.primary025, borderColor: theme.primary025 }]}
        placeholderTextColor={theme.primary050}
        {...props}
      />
    </>
  );
});

InputText.displayName = 'InputText';

type Style = {
  inputText: TextStyle;
};

const styles = StyleSheet.create<Style>({
  inputText: {
    borderBottomWidth: 1,
    paddingBottom: 15,
    fontSize: 22,
  },
});
