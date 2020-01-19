import React from 'react';
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

type WordsScreenNavigationProps = StackNavigationProp<DictionariesStackParamList, typeof WORDS_SCREEN>;

type Props = {
  word: Word;
  navigation: WordsScreenNavigationProps;
  testID: string;
  children?: never;
};

export class WordRow extends React.Component<Props> {
  swipeableRef = React.createRef<Swipeable>();

  closeSwipeable = () => {
    const { current } = this.swipeableRef;
    if (current != null) {
      current.close();
    }
  };

  handleEditPress = () => {
    this.closeSwipeable();
    const { navigation, word } = this.props;
    navigation.push(WORDS_EDIT_SCREEN, { [PARAM_WORD]: word });
  };

  handleDeletePress = () => {
    Alert.alert(
      'Delete word',
      'Do you want to delete this word?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            this.closeSwipeable();
          },
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteWord(this.props.word);
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  renderRightActions = (progress: Animated.AnimatedInterpolation) => {
    const { word } = this.props;
    return (
      <SwipeActions width={192}>
        <SwipeAction
          progress={progress}
          dragX={128}
          onPress={this.handleEditPress}
          text="Edit"
          backgroundColor={INFO}
          testID={WORDS_ROW_EDIT(word.id)}
        />
        <SwipeAction
          progress={progress}
          dragX={64}
          onPress={this.handleDeletePress}
          text="Delete"
          backgroundColor={DANGER}
          testID={WORDS_ROW_DELETE(word.id)}
        />
      </SwipeActions>
    );
  };

  render() {
    const { word, testID } = this.props;
    return (
      <Swipeable renderRightActions={this.renderRightActions} ref={this.swipeableRef}>
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
}
