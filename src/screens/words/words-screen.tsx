import React from 'react';
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
import { RouteProp } from '@react-navigation/native';

type WordsScreenNavigationProps = StackNavigationProp<DictionariesStackParamList, typeof WORDS_SCREEN>;
type WordsScreenRouteProps = RouteProp<DictionariesStackParamList, typeof WORDS_SCREEN>;

type Props = {
  navigation: WordsScreenNavigationProps;
  route: WordsScreenRouteProps;
};

type State = {
  hasFilterEnabled: boolean;
};

export class WordsScreen extends React.Component<Props, State> {
  state: State = {
    hasFilterEnabled: false,
  };

  public componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => <FilterOpenButton onPress={this.onOpenFilterPress} />,
      title: this.props.route.params[PARAM_SCREEN_TITLE],
    });
  }

  private onOpenFilterPress = () => {
    this.setState({
      hasFilterEnabled: true,
    });
    this.props.navigation.setOptions({
      headerShown: false,
    });
  };

  private onCloseFilter = () => {
    this.setState({
      hasFilterEnabled: false,
    });
    this.props.navigation.setOptions({
      headerShown: true,
    });
  };

  query: FirebaseFirestoreTypes.Query = firestore()
    .collection(WORDS)
    .where('dictionary', '==', this.props.route.params[PARAM_DICTIONARY].id);
  // Throw an error :/
  // https://github.com/invertase/react-native-firebase/issues/1437
  // .orderBy('updatedAt', 'desc')

  filterWords(filter: string, word: Word) {
    return (
      word.value.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
      word.signification.toLowerCase().indexOf(filter.toLowerCase()) > -1
    );
  }

  handleAddWordPress = () => {
    const { navigation, route } = this.props;
    navigation.push(WORDS_CREATE_SCREEN, {
      [PARAM_DICTIONARY_ID]: route.params.dictionary.id,
    });
  };

  renderWord = ({ item }: { item: Word }) => {
    return <WordRow word={item} navigation={this.props.navigation} testID={WORDS_ROW(item.id)} />;
  };

  render() {
    return (
      <FiltrableList
        query={this.query}
        renderItem={this.renderWord}
        documentSnapshotToEntity={documentSnapshotToWord}
        onAddPress={this.handleAddWordPress}
        emptyListMessage="Press the add button to add a new word."
        testID={WORDS_SCREEN_E2E}
        filterEntities={this.filterWords}
        hasFilterEnabled={this.state.hasFilterEnabled}
        onCloseFilter={this.onCloseFilter}
      />
    );
  }
}
