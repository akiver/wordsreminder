import React, { useEffect, useRef, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { WORDS } from '@constants/database';
import { WORDS_CREATE_SCREEN, WORDS_SCREEN } from '@constants/screens';
import { documentSnapshotToWord, Word } from '@models/word';
import { WordRow } from '@words/word-row';
import { FiltrableList } from '@components/list/filtrable-list';
import { WORDS_ROW, WORDS_SCREEN as WORDS_SCREEN_E2E } from '@e2e/ids';
import { FilterOpenButton } from '@components/filter-open-button';
import { PARAM_DICTIONARY, PARAM_SCREEN_TITLE, PARAM_DICTIONARY_ID } from '@constants/navigation-parameters';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

function renderWord({ item }: { item: Word }) {
  return <WordRow word={item} testID={WORDS_ROW(item.id)} />;
}

function filterWords(filter: string, word: Word) {
  return (
    word.value.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
    word.signification.toLowerCase().indexOf(filter.toLowerCase()) > -1
  );
}

type NavigationProps = StackNavigationProp<DictionariesStackParamList, typeof WORDS_SCREEN>;
type RouteProps = RouteProp<DictionariesStackParamList, typeof WORDS_SCREEN>;

export function WordsScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const [hasFilterEnabled, setHasFilterEnabled] = useState(false);
  const query = useRef<FirebaseFirestoreTypes.Query>(
    firestore().collection(WORDS).where('dictionary', '==', route.params[PARAM_DICTIONARY].id)
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const onOpenFilterPress = () => {
          setHasFilterEnabled(true);
          navigation.setOptions({
            headerShown: false,
          });
        };

        return <FilterOpenButton onPress={onOpenFilterPress} />;
      },
      title: route.params[PARAM_SCREEN_TITLE],
    });
  }, [navigation, route.params]);

  const onCloseFilter = () => {
    setHasFilterEnabled(false);
    navigation.setOptions({
      headerShown: true,
    });
  };

  const onAddWordPress = () => {
    navigation.push(WORDS_CREATE_SCREEN, {
      [PARAM_DICTIONARY_ID]: route.params.dictionary.id,
    });
  };

  return (
    <FiltrableList<Word>
      query={query.current}
      renderItem={renderWord}
      documentSnapshotToEntity={documentSnapshotToWord}
      onAddPress={onAddWordPress}
      emptyListMessage="Press the add button to add a new word."
      testID={WORDS_SCREEN_E2E}
      filterEntities={filterWords}
      hasFilterEnabled={hasFilterEnabled}
      onCloseFilter={onCloseFilter}
    />
  );
}
