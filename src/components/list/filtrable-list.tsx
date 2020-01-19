import React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import memoize from 'memoize-one';
import { AddButton } from '@components/add-button';
import { STATUS_ERROR, STATUS_SUCCESS, STATUS_LOADING, STATUS } from '@constants/statuses';
import { ErrorMessage } from '@components/error-message';
import { ActivityIndicator } from '@components/activity-indicator';
import { getErrorMessageFromFirestoreError } from '@utils/get-error-message-from-firestore-error';
import { Spacer } from '@components/spacer';
import { Text } from '@components/text';
import { MainView } from '@components/main-view';
import { ADD_BUTTON, EMPTY_LIST_MESSAGE } from '@e2e/ids';
import { FilterBar } from './filter-bar';
import { isStringEmpty } from '@utils/is-string-empty';
import { Entity } from '@models/entity';

type Props = {
  query: FirebaseFirestoreTypes.Query;
  onAddPress: () => void;
  documentSnapshotToEntity: (doc: FirebaseFirestoreTypes.DocumentSnapshot) => Entity;
  renderItem: ListRenderItem<any>;
  emptyListMessage: string;
  filterEntities: (filter: string, entity: any) => boolean;
  testID: string;
  onCloseFilter: () => void;
  hasFilterEnabled: boolean;
};

type State = typeof initialState;

const initialState = Object.freeze({
  entities: [] as Entity[],
  filter: undefined as string | undefined,
  isRefreshing: false,
  status: STATUS_LOADING as STATUS,
  error: undefined as string | undefined,
});

export class FiltrableList extends React.PureComponent<Props, State> {
  readonly state = initialState;

  unsubscribe?: () => void;

  query = this.props.query;

  filterEntities = memoize((entities: Entity[], filter?: string) => {
    let filteredEntities = entities;
    if (!isStringEmpty(filter)) {
      filteredEntities = entities.filter(entity => this.props.filterEntities(filter!, entity));
    }

    // Have to manually sort entities because chaining firestore().where().orderBy() throw an error.
    // https://github.com/invertase/react-native-firebase/issues/1437
    return filteredEntities.sort(this.compareUpdatedAt);
  });

  async componentDidMount() {
    this.unsubscribe = this.query.onSnapshot(this.onCollectionUpdate, this.onCollectionError);
    await this.refreshEntities();
  }

  componentWillUnmount() {
    if (this.unsubscribe !== undefined) {
      this.unsubscribe();
    }
  }

  compareUpdatedAt(e1: Entity, e2: Entity) {
    if (e2.updatedAt == null || e1.updatedAt == null) {
      return 0;
    }
    return e2.updatedAt.toMillis() - e1.updatedAt.toMillis();
  }

  onCollectionUpdate = (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
    let entities: Entity[] = Array.from(this.state.entities);
    querySnapshot.docChanges().forEach((docChange: FirebaseFirestoreTypes.DocumentChange) => {
      const entity = this.props.documentSnapshotToEntity(docChange.doc);
      switch (docChange.type) {
        case 'added':
          entities.push(entity);
          break;
        case 'removed':
          entities = entities.filter(e => e.id !== entity.id);
          break;
        case 'modified':
          entities = entities.map(e => {
            if (e.id === entity.id) {
              return entity;
            }

            return e;
          });
          break;
        default:
      }
    });

    this.setState({
      entities,
    });
  };

  onCollectionError = (error: Error) => {
    const errorMessage = getErrorMessageFromFirestoreError(error);
    this.setState({
      status: STATUS_ERROR as STATUS,
      error: errorMessage,
    });
  };

  async refreshEntities() {
    try {
      const snap = await this.query.get();
      this.setState({
        entities: snap.docs.map(doc => this.props.documentSnapshotToEntity(doc)).sort(this.compareUpdatedAt),
        status: STATUS_SUCCESS,
      });
    } catch (error) {
      this.setState({
        status: STATUS_ERROR,
        error: getErrorMessageFromFirestoreError(error),
      });
    }
  }

  keyExtractor = (entity: Entity): string => entity.id!;

  handleRefresh = () => {
    this.setState(
      {
        isRefreshing: true,
      },
      async () => {
        await this.refreshEntities();
        this.setState({
          isRefreshing: false,
        });
      }
    );
  };

  handleFilterChange = (filter: string) => {
    this.setState({
      filter,
    });
  };

  handleCloseFilterPress = () => {
    this.props.onCloseFilter();
    this.setState({
      filter: undefined,
    });
  };

  renderContent = () => {
    const { status } = this.state;

    if (status === STATUS_LOADING) {
      return <ActivityIndicator />;
    }

    if (status === STATUS_ERROR) {
      return <ErrorMessage message={this.state.error!} />;
    }

    const entities = this.filterEntities(this.state.entities, this.state.filter);
    if (entities.length === 0) {
      return (
        <Spacer marginTop={10} marginLeft={10} marginRight={10}>
          <Text testID={EMPTY_LIST_MESSAGE} color="primary025" fontSize={20}>
            {this.props.emptyListMessage}
          </Text>
        </Spacer>
      );
    }

    return (
      <FlatList
        data={entities}
        renderItem={this.props.renderItem}
        keyExtractor={this.keyExtractor}
        refreshing={this.state.isRefreshing}
        onRefresh={this.handleRefresh}
        keyboardShouldPersistTaps="handled"
      />
    );
  };

  render() {
    return (
      <MainView testID={this.props.testID}>
        {this.props.hasFilterEnabled && (
          <FilterBar onCloseFilterPress={this.handleCloseFilterPress} onFilterChange={this.handleFilterChange} />
        )}
        {this.renderContent()}
        <AddButton onPress={this.props.onAddPress} testID={ADD_BUTTON(this.props.testID)} />
      </MainView>
    );
  }
}
