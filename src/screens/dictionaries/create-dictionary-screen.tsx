import React, { useEffect, useRef, useState } from 'react';
import { InputText } from '@components/input-text';
import { createDictionary } from '@services/create-dictionary';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { SaveButton } from '@components/save-button';
import { isStringEmpty } from '@utils/is-string-empty';
import { FormLayout } from '@components/form-layout';
import { TextInput, View } from 'react-native';
import { DICTIONARY_CREATE_INPUT_NAME, DICTIONARY_CREATE_SCREEN_ID } from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';
import { useNavigation } from '@react-navigation/native';
import { DICTIONARIES_CREATE_SCREEN } from '@constants/screens';

type NavigationProps = StackNavigationProp<DictionariesStackParamList, typeof DICTIONARIES_CREATE_SCREEN>;

export function CreateDictionaryScreen() {
  const navigation = useNavigation<NavigationProps>();
  const inputRef = useRef<TextInput>(null);
  const [status, setStatus] = useState<STATUS>(STATUS_IDLE);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const onSavePress = async () => {
    try {
      setStatus(STATUS_LOADING);
      await createDictionary(name);
      navigation.goBack();
    } catch (error) {
      setStatus(STATUS_ERROR);
      setError(error instanceof Error ? error.message : 'An error occurred.');
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const isDisabled = status === STATUS_LOADING || isStringEmpty(name);

        return <SaveButton onPress={onSavePress} disabled={isDisabled} status={status} />;
      },
    });
  });

  const onNameChange = (name: string) => {
    setName(name);
  };

  return (
    <FormLayout status={status} error={error}>
      <View testID={DICTIONARY_CREATE_SCREEN_ID}>
        <InputText
          ref={inputRef}
          label="Name"
          onChangeText={onNameChange}
          onSubmitEditing={onSavePress}
          returnKeyType="send"
          maxLength={40}
          autoFocus={true}
          placeholder="Dictionary's name"
          testID={DICTIONARY_CREATE_INPUT_NAME}
        />
      </View>
    </FormLayout>
  );
}
