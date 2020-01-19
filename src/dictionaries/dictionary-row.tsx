import React from 'react';
import { Alert, StyleSheet, View, ViewStyle, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { WORDS_SCREEN, DICTIONARIES_EDIT_SCREEN, DICTIONARIES_SCREEN } from '@constants/screens';
import { ClockIcon } from '@components/svg/clock-icon';
import { Text } from '@components/text';
import { Spacer } from '@components/spacer';
import { deleteDictionary } from '@services/delete-dictionary';
import { SwipeAction } from '@components/swipe-action';
import { SwipeActions } from '@components/swipe-actions';
import { ListRow } from '@components/list-row';
import { INFO, DANGER } from '@constants/colors';
import {
  DICTIONARIES_ROW_EDIT,
  DICTIONARIES_ROW_DELETE,
  DICTIONARIES_ROW_NAME,
  DICTIONARIES_ROW_WORDS_COUNT,
  DICTIONARIES_ROW_UPDATED_AT,
} from '@e2e/ids';
import { PARAM_DICTIONARY, PARAM_SCREEN_TITLE } from '@constants/navigation-parameters';
import { Dictionary } from '@models/dictionary';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';

type DictionariesScreenNavigationProps = StackNavigationProp<DictionariesStackParamList, typeof DICTIONARIES_SCREEN>;

type Props = {
  navigation: DictionariesScreenNavigationProps;
  dictionary: Dictionary;
  testID: string;
};

export class DictionaryRow extends React.Component<Props> {
  swipeableRef = React.createRef<Swipeable>();

  closeSwipeable = () => {
    if (this.swipeableRef.current != null) {
      this.swipeableRef.current.close();
    }
  };

  handleEntryPress = () => {
    this.closeSwipeable();
    const { navigation, dictionary } = this.props;
    navigation.push(WORDS_SCREEN, {
      [PARAM_DICTIONARY]: dictionary,
      [PARAM_SCREEN_TITLE]: dictionary.name,
    });
  };

  handleEditPress = () => {
    this.closeSwipeable();
    const { navigation, dictionary } = this.props;
    navigation.push(DICTIONARIES_EDIT_SCREEN, {
      [PARAM_DICTIONARY]: dictionary,
    });
  };

  handleDeletePress = () => {
    Alert.alert(
      'Delete dictionary',
      'Do you want to delete this dictionary?',
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
              await deleteDictionary(this.props.dictionary);
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
    const { dictionary } = this.props;
    return (
      <SwipeActions width={192}>
        <SwipeAction
          progress={progress}
          dragX={128}
          onPress={this.handleEditPress}
          text="Edit"
          backgroundColor={INFO}
          testID={DICTIONARIES_ROW_EDIT(dictionary.id)}
        />
        <SwipeAction
          progress={progress}
          dragX={64}
          onPress={this.handleDeletePress}
          text="Delete"
          backgroundColor={DANGER}
          testID={DICTIONARIES_ROW_DELETE(dictionary.id)}
        />
      </SwipeActions>
    );
  };

  render() {
    const { dictionary } = this.props;
    return (
      <Swipeable renderRightActions={this.renderRightActions} ref={this.swipeableRef}>
        <ListRow onPress={this.handleEntryPress} testID={this.props.testID}>
          <>
            <Text fontSize={20} testID={DICTIONARIES_ROW_NAME(dictionary.id)}>
              {dictionary.name}
            </Text>
            <View style={styles.details}>
              <Text fontSize={18} color="primary050" testID={DICTIONARIES_ROW_WORDS_COUNT}>
                {`${dictionary.words.length} word(s)`}
              </Text>
              {dictionary.updatedAt !== null && (
                <View style={styles.updatedAt} testID={DICTIONARIES_ROW_UPDATED_AT}>
                  <ClockIcon />
                  <Spacer marginLeft={5}>
                    <Text fontSize={16} color="primary050">
                      {dictionary.updatedAt.toDate().toLocaleDateString()}
                    </Text>
                  </Spacer>
                </View>
              )}
            </View>
          </>
        </ListRow>
      </Swipeable>
    );
  }
}

type Style = {
  details: ViewStyle;
  updatedAt: ViewStyle;
};

const styles = StyleSheet.create<Style>({
  details: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  updatedAt: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
