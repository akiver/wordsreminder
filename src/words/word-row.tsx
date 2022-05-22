import React, { useRef } from 'react';
import { Alert, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { WORDS_EDIT_SCREEN, WORDS_SCREEN } from '@constants/screens';
import { Text } from '@components/text';
import { Spacer } from '@components/spacer';
import { isStringEmpty } from '@utils/is-string-empty';
import { deleteWord } from '@services/delete-word';
import { SwipeAction } from '@components/swipe-action';
import { SwipeActions } from '@components/swipe-actions';
import { ListRow } from '@components/list-row';
import { INFO, DANGER } from '@constants/colors';
import {
  WORDS_ROW_EDIT,
  WORDS_ROW_DELETE,
  WORDS_ROW_VALUE,
  WORDS_ROW_SIGNIFICATION,
  WORDS_ROW_DESCRIPTION,
} from '@e2e/ids';
import { PARAM_WORD } from '@constants/navigation-parameters';
import { Word } from '@models/word';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<DictionariesStackParamList, typeof WORDS_SCREEN>;

type Props = {
  word: Word;
  testID: string;
};

export function WordRow({ word, testID }: Props) {
  const navigation = useNavigation<NavigationProps>();
  const swipeableRef = useRef<Swipeable>(null);

  const closeSwipeable = () => {
    swipeableRef.current?.close();
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation) => {
    const onEditPress = () => {
      closeSwipeable();
      navigation.push(WORDS_EDIT_SCREEN, { [PARAM_WORD]: word });
    };

    const handleDeletePress = () => {
      Alert.alert(
        'Delete word',
        'Do you want to delete this word?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: closeSwipeable,
          },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                await deleteWord(word);
              } catch (error) {
                let errorMessage: string;
                if (error instanceof Error) {
                  errorMessage = error.message;
                } else {
                  errorMessage = 'An error occurred while deleting the word.';
                }
                Alert.alert('Error', errorMessage);
              }
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    };

    return (
      <SwipeActions width={192}>
        <SwipeAction
          progress={progress}
          dragX={128}
          onPress={onEditPress}
          text="Edit"
          backgroundColor={INFO}
          testID={WORDS_ROW_EDIT(word.id)}
        />
        <SwipeAction
          progress={progress}
          dragX={64}
          onPress={handleDeletePress}
          text="Delete"
          backgroundColor={DANGER}
          testID={WORDS_ROW_DELETE(word.id)}
        />
      </SwipeActions>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} ref={swipeableRef}>
      <ListRow testID={testID}>
        <>
          <Text fontSize={20} testID={WORDS_ROW_VALUE(word.id)}>
            {word.value}
          </Text>
          <Spacer marginTop={5}>
            <Text fontSize={18} color="primary050" testID={WORDS_ROW_SIGNIFICATION}>
              {word.signification}
            </Text>
          </Spacer>
          {!isStringEmpty(word.description) && (
            <Spacer marginTop={5}>
              {word.description !== undefined && (
                <Text color="primary075" testID={WORDS_ROW_DESCRIPTION}>
                  {word.description}
                </Text>
              )}
            </Spacer>
          )}
        </>
      </ListRow>
    </Swipeable>
  );
}
