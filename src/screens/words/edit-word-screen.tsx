import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { InputText } from '@components/input-text';
import { SaveButton } from '@components/save-button';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { isStringEmpty } from '@utils/is-string-empty';
import { updateWord } from '@services/update-word';
import { FormLayout } from '@components/form-layout';
import { Spacer } from '@components/spacer';
import {
  WORD_EDIT_SCREEN,
  WORD_EDIT_INPUT_VALUE,
  WORD_EDIT_INPUT_SIGNIFICATION,
  WORD_EDIT_INPUT_DESCRIPTION,
} from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { WORDS_EDIT_SCREEN } from '@constants/screens';
import { Word } from '@models/word';

type NavigationProps = StackNavigationProp<DictionariesStackParamList, typeof WORDS_EDIT_SCREEN>;
type RouteProps = RouteProp<DictionariesStackParamList, typeof WORDS_EDIT_SCREEN>;

export function EditWordScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const significationRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
  const [status, setStatus] = useState<STATUS>(STATUS_IDLE);
  const [error, setError] = useState<string | undefined>(undefined);
  const [word, setWord] = useState<Word>(route.params.word);

  useEffect(() => {
    const onSavePress = async () => {
      try {
        setStatus(STATUS_LOADING);
        await updateWord(word);
        navigation.goBack();
      } catch (error) {
        setStatus(STATUS_ERROR);
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    };

    navigation.setOptions({
      headerRight: () => {
        const isDisabled = status === STATUS_LOADING || isStringEmpty(word.value) || isStringEmpty(word.signification);

        return <SaveButton disabled={isDisabled} onPress={onSavePress} status={status} />;
      },
    });
  });

  const onWordChange = (wordValue: string) => {
    setWord({
      ...word,
      value: wordValue,
    });
  };

  const onSignificationChange = (signification: string) => {
    setWord({
      ...word,
      signification,
    });
  };

  const onDescriptionChange = (description: string): void => {
    setWord({
      ...word,
      description,
    });
  };

  const onWordSubmitEditing = () => {
    significationRef.current?.focus();
  };

  const onSignificationSubmitEditing = () => {
    descriptionRef.current?.focus();
  };

  return (
    <FormLayout status={status} error={error}>
      <View testID={WORD_EDIT_SCREEN}>
        <InputText
          label="Word"
          placeholder="Word"
          onChangeText={onWordChange}
          autoFocus={true}
          onSubmitEditing={onWordSubmitEditing}
          returnKeyType="next"
          value={word.value}
          testID={WORD_EDIT_INPUT_VALUE}
        />
        <Spacer marginTop={10}>
          <InputText
            label="Signification"
            placeholder="Word's signification"
            onChangeText={onSignificationChange}
            ref={significationRef}
            returnKeyType="next"
            onSubmitEditing={onSignificationSubmitEditing}
            value={word.signification}
            testID={WORD_EDIT_INPUT_SIGNIFICATION}
          />
        </Spacer>
        <Spacer marginTop={10}>
          <InputText
            label="Description"
            placeholder="Write an optional word's description"
            onChangeText={onDescriptionChange}
            multiline={true}
            ref={descriptionRef}
            value={word.description}
            testID={WORD_EDIT_INPUT_DESCRIPTION}
          />
        </Spacer>
      </View>
    </FormLayout>
  );
}
