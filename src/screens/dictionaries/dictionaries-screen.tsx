import React from 'react';
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
import { RouteProp } from '@react-navigation/native';

type DictionariesScreenNavigationProps = StackNavigationProp<DictionariesStackParamList, typeof DICTIONARIES_SCREEN>;
type DictionariesScreenRouteProps = RouteProp<DictionariesStackParamList, typeof DICTIONARIES_SCREEN>;

type Props = {
  navigation: DictionariesScreenNavigationProps;
  route: DictionariesScreenRouteProps;
};

type State = {
  hasFilterEnabled: boolean;
};

export class DictionariesScreen extends React.Component<Props, State> {
  state: State = {
    hasFilterEnabled: false,
  };

  public componentDidMount() {
    this.props.navigation.setOptions({
      title: 'Dictionaries',
      headerRight: () => <FilterOpenButton onPress={this.onOpenFilterPress} />,
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

  query: FirebaseFirestoreTypes.Query = firestore().collection(DICTIONARIES).orderBy('updatedAt', 'desc');

  filterDictionaries(filter: string, dictionary: Dictionary) {
    return dictionary.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
  }

  handleAddDictionaryPress = () => {
    this.props.navigation.push(DICTIONARIES_CREATE_SCREEN);
  };

  renderDictionary = ({ item }: { item: Dictionary }) => {
    return <DictionaryRow dictionary={item} navigation={this.props.navigation} testID={DICTIONARIES_ROW(item.id)} />;
  };

  onCloseFilter = () => {
    this.setState({
      hasFilterEnabled: false,
    });
    this.props.navigation.setOptions({
      headerShown: true,
    });
  };

  render() {
    return (
      <FiltrableList
        query={this.query}
        renderItem={this.renderDictionary}
        documentSnapshotToEntity={documentSnapshotToDictionary}
        onAddPress={this.handleAddDictionaryPress}
        emptyListMessage="Press the add button to add a new dictionary."
        testID={DICTIONARIES_SCREEN_ID}
        filterEntities={this.filterDictionaries}
        onCloseFilter={this.onCloseFilter}
        hasFilterEnabled={this.state.hasFilterEnabled}
      />
    );
  }
}
