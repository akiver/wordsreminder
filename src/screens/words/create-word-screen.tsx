import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { InputText } from '@components/input-text';
import { SaveButton } from '@components/save-button';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { createWord } from '@services/create-word';
import { isStringEmpty } from '@utils/is-string-empty';
import { FormLayout } from '@components/form-layout';
import { Spacer } from '@components/spacer';
import {
  WORD_CREATE_SCREEN,
  WORD_CREATE_INPUT_VALUE,
  WORD_CREATE_INPUT_SIGNIFICATION,
  WORD_CREATE_INPUT_DESCRIPTION,
} from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { WORDS_CREATE_SCREEN } from '@constants/screens';

type NavigationProps = StackNavigationProp<DictionariesStackParamList, typeof WORDS_CREATE_SCREEN>;
type RouteProps = RouteProp<DictionariesStackParamList, typeof WORDS_CREATE_SCREEN>;

export function CreateWordScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const significationRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
  const [status, setStatus] = useState<STATUS>(STATUS_IDLE);
  const [word, setWord] = useState('');
  const [signification, setSignification] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const onAddPress = async () => {
      try {
        await createWord(route.params.dictionaryId, word, signification, description);
        navigation.goBack();
      } catch (error) {
        setStatus(STATUS_ERROR);
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    };

    const isDisabled = status === STATUS_LOADING || isStringEmpty(word) || isStringEmpty(signification);

    navigation.setOptions({
      title: 'Add a word',
      headerRight: () => {
        return <SaveButton disabled={isDisabled} onPress={onAddPress} status={status} />;
      },
    });
  });

  const onWordChange = (word: string) => {
    setWord(word);
  };

  const onSignificationChange = (signification: string) => {
    setSignification(signification);
  };

  const onDescriptionChange = (description: string): void => {
    setDescription(description);
  };

  const onWordSubmitEditing = () => {
    significationRef.current?.focus();
  };

  const onSignificationSubmitEditing = () => {
    descriptionRef.current?.focus();
  };

  return (
    <FormLayout status={status} error={error}>
      <View testID={WORD_CREATE_SCREEN}>
        <InputText
          label="Word"
          placeholder="Word"
          onChangeText={onWordChange}
          autoFocus={true}
          onSubmitEditing={onWordSubmitEditing}
          returnKeyType="next"
          testID={WORD_CREATE_INPUT_VALUE}
        />
        <Spacer marginTop={10}>
          <InputText
            label="Signification"
            placeholder="Word's signification"
            onChangeText={onSignificationChange}
            ref={significationRef}
            returnKeyType="next"
            onSubmitEditing={onSignificationSubmitEditing}
            testID={WORD_CREATE_INPUT_SIGNIFICATION}
          />
        </Spacer>
        <Spacer marginTop={10}>
          <InputText
            label="Description"
            placeholder="Write an optional word's description"
            onChangeText={onDescriptionChange}
            multiline={true}
            ref={descriptionRef}
            testID={WORD_CREATE_INPUT_DESCRIPTION}
          />
        </Spacer>
      </View>
    </FormLayout>
  );
}
