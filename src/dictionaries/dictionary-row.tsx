import React, { useRef } from 'react';
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
import { useNavigation } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<DictionariesStackParamList, typeof DICTIONARIES_SCREEN>;

type Props = {
  dictionary: Dictionary;
  testID: string;
};

export function DictionaryRow({ dictionary, testID }: Props) {
  const navigation = useNavigation<NavigationProps>();
  const swipeableRef = useRef<Swipeable>(null);

  const closeSwipeable = () => {
    swipeableRef.current?.close();
  };

  const onRowPress = () => {
    closeSwipeable();
    navigation.push(WORDS_SCREEN, {
      [PARAM_DICTIONARY]: dictionary,
      [PARAM_SCREEN_TITLE]: dictionary.name,
    });
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Delete dictionary',
      'Do you want to delete this dictionary?',
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
              await deleteDictionary(dictionary);
            } catch (error) {
              let errorMessage: string;
              if (error instanceof Error) {
                errorMessage = error.message;
              } else {
                errorMessage = 'An error occurred while deleting the dictionary';
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

  const renderRightActions = (progress: Animated.AnimatedInterpolation) => {
    const onEditPress = () => {
      closeSwipeable();
      navigation.push(DICTIONARIES_EDIT_SCREEN, {
        [PARAM_DICTIONARY]: dictionary,
      });
    };

    return (
      <SwipeActions width={192}>
        <SwipeAction
          progress={progress}
          dragX={128}
          onPress={onEditPress}
          text="Edit"
          backgroundColor={INFO}
          testID={DICTIONARIES_ROW_EDIT(dictionary.id)}
        />
        <SwipeAction
          progress={progress}
          dragX={64}
          onPress={handleDeletePress}
          text="Delete"
          backgroundColor={DANGER}
          testID={DICTIONARIES_ROW_DELETE(dictionary.id)}
        />
      </SwipeActions>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} ref={swipeableRef}>
      <ListRow onPress={onRowPress} testID={testID}>
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
