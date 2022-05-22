import React, { useEffect, useRef, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { DICTIONARIES } from '@constants/database';
import { DICTIONARIES_CREATE_SCREEN, DICTIONARIES_SCREEN } from '@constants/screens';
import { DictionaryRow } from '@dictionaries/dictionary-row';
import { documentSnapshotToDictionary, Dictionary } from '@models/dictionary';
import { FiltrableList } from '@components/list/filtrable-list';
import { DICTIONARIES_SCREEN_ID, DICTIONARIES_ROW } from '@e2e/ids';
import { FilterOpenButton } from '@components/filter-open-button';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = StackNavigationProp<DictionariesStackParamList, typeof DICTIONARIES_SCREEN>;

function filterDictionaries(filter: string, dictionary: Dictionary) {
  return dictionary.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
}

function renderDictionary({ item }: { item: Dictionary }) {
  return <DictionaryRow dictionary={item} testID={DICTIONARIES_ROW(item.id)} />;
}

export function DictionariesScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [hasFilterEnabled, setHasFilterEnabled] = useState(false);
  const query = useRef<FirebaseFirestoreTypes.Query>(firestore().collection(DICTIONARIES).orderBy('updatedAt', 'desc'));

  useEffect(() => {
    const onOpenFilterPress = () => {
      setHasFilterEnabled(true);
      navigation.setOptions({
        headerShown: false,
      });
    };

    navigation.setOptions({
      title: 'Dictionaries',
      headerRight: () => <FilterOpenButton onPress={onOpenFilterPress} />,
    });
  }, [navigation]);

  const onAddDictionaryPress = () => {
    navigation.push(DICTIONARIES_CREATE_SCREEN);
  };

  const onCloseFilter = () => {
    setHasFilterEnabled(false);
    navigation.setOptions({
      headerShown: true,
    });
  };

  return (
    <FiltrableList<Dictionary>
      query={query.current}
      renderItem={renderDictionary}
      documentSnapshotToEntity={documentSnapshotToDictionary}
      onAddPress={onAddDictionaryPress}
      emptyListMessage="Press the add button to add a new dictionary."
      testID={DICTIONARIES_SCREEN_ID}
      filterEntities={filterDictionaries}
      onCloseFilter={onCloseFilter}
      hasFilterEnabled={hasFilterEnabled}
    />
  );
}
