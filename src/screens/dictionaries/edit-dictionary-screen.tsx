import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { InputText } from '@components/input-text';
import { SaveButton } from '@components/save-button';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { updateDictionary } from '@services/update-dictionary';
import { FormLayout } from '@components/form-layout';
import { DICTIONARY_EDIT_SCREEN_ID, DICTIONARY_EDIT_INPUT_NAME } from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DICTIONARIES_EDIT_SCREEN } from '@constants/screens';
import { Dictionary } from '@models/dictionary';
import { isStringEmpty } from '@utils/is-string-empty';

type NavigationProps = StackNavigationProp<DictionariesStackParamList, typeof DICTIONARIES_EDIT_SCREEN>;
type RouteProps = RouteProp<DictionariesStackParamList, typeof DICTIONARIES_EDIT_SCREEN>;

export function EditDictionaryScreen() {
  const navigation = useNavigation<NavigationProps>();
  const inputRef = useRef<TextInput>(null);
  const route = useRoute<RouteProps>();
  const [status, setStatus] = useState<STATUS>(STATUS_IDLE);
  const [error, setError] = useState<string | undefined>(undefined);
  const [dictionary, setDictionary] = useState<Dictionary>(route.params.dictionary);

  const submit = async () => {
    if (dictionary.name === route.params.dictionary.name) {
      navigation.goBack();
      return;
    }

    try {
      setStatus(STATUS_LOADING);
      await updateDictionary(dictionary);
      navigation.goBack();
    } catch (error) {
      setStatus(STATUS_ERROR);
      setError(error instanceof Error ? error.message : 'An error occurred');
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const isDisabled =
          status === STATUS_LOADING ||
          isStringEmpty(dictionary.name) ||
          dictionary.name === route.params.dictionary.name;

        return <SaveButton disabled={isDisabled} onPress={submit} status={status} />;
      },
    });
  });

  const onNameChange = (name: string) => {
    setDictionary({ ...dictionary, name });
  };

  return (
    <FormLayout status={status} error={error}>
      <View testID={DICTIONARY_EDIT_SCREEN_ID}>
        <InputText
          ref={inputRef}
          label="Name"
          placeholder="Dictionary's name"
          onChangeText={onNameChange}
          autoFocus={true}
          returnKeyType="send"
          onSubmitEditing={submit}
          value={dictionary.name}
          testID={DICTIONARY_EDIT_INPUT_NAME}
        />
      </View>
    </FormLayout>
  );
}
