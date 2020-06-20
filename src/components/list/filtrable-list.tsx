import React, { useState, useEffect } from 'react';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
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
import { useTheme } from '@hooks/use-theme';

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

type State = {
  entities: Entity[];
  filter: string | undefined;
  isRefreshing: boolean;
  status: STATUS;
  error: string | undefined;
};

const compareUpdatedAt = (e1: Entity, e2: Entity) => {
  if (e2.updatedAt == null || e1.updatedAt == null) {
    return 0;
  }
  return e2.updatedAt.toMillis() - e1.updatedAt.toMillis();
};

export const FiltrableList = ({
  hasFilterEnabled,
  emptyListMessage,
  renderItem,
  documentSnapshotToEntity,
  query,
  testID,
  onAddPress,
  onCloseFilter,
  filterEntities,
}: Props) => {
  const [state, setState] = useState<State>({
    entities: [],
    error: undefined,
    filter: undefined,
    isRefreshing: false,
    status: STATUS_LOADING,
  });
  const theme = useTheme();

  const getEntitiesFromQuerySnapshot = (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
    return querySnapshot.docs.map((doc) => documentSnapshotToEntity(doc)).sort(compareUpdatedAt);
  };

  useEffect(() => {
    const onCollectionUpdate = (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
      setState({
        ...state,
        status: STATUS_SUCCESS,
        entities: getEntitiesFromQuerySnapshot(querySnapshot),
      });
    };

    const onCollectionError = (error: Error) => {
      const errorMessage = getErrorMessageFromFirestoreError(error);
      setState({
        ...state,
        status: STATUS_ERROR,
        error: errorMessage,
      });
    };

    const unsubscribe = query.onSnapshot(onCollectionUpdate, onCollectionError);

    return () => {
      unsubscribe();
    };
  }, []);

  const filterCurrentEntities = memoize((entities: Entity[], filter?: string) => {
    let filteredEntities = entities;
    if (!isStringEmpty(filter)) {
      filteredEntities = entities.filter((entity) => filterEntities(filter as string, entity));
    }

    return filteredEntities.sort(compareUpdatedAt);
  });

  const refreshEntities = async () => {
    try {
      const querySnapShot = await query.get();

      setState({
        ...state,
        status: STATUS_SUCCESS,
        entities: getEntitiesFromQuerySnapshot(querySnapShot),
      });
    } catch (error) {
      setState({
        ...state,
        status: STATUS_ERROR,
        error: getErrorMessageFromFirestoreError(error),
      });
    }
  };

  const renderContent = () => {
    const { status } = state;
    if (status === STATUS_LOADING) {
      return <ActivityIndicator />;
    }

    if (status === STATUS_ERROR) {
      return <ErrorMessage message={state.error as string} />;
    }

    const filteredEntities = filterCurrentEntities(state.entities, state.filter);
    if (filteredEntities.length === 0) {
      return (
        <Spacer marginTop={10} marginLeft={10} marginRight={10}>
          <Text testID={EMPTY_LIST_MESSAGE} color="primary025" fontSize={20}>
            {emptyListMessage}
          </Text>
        </Spacer>
      );
    }

    return (
      <FlatList
        data={filteredEntities}
        renderItem={renderItem}
        keyExtractor={(entity: Entity): string => entity.id}
        refreshing={state.isRefreshing}
        onRefresh={async () => {
          setState({
            ...state,
            isRefreshing: true,
          });
          await refreshEntities();
          setState({
            ...state,
            isRefreshing: false,
          });
        }}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={state.isRefreshing} tintColor={theme.primary025} />}
      />
    );
  };

  return (
    <MainView testID={testID}>
      {hasFilterEnabled && (
        <FilterBar
          onCloseFilterPress={() => {
            onCloseFilter();
            setState({
              ...state,
              filter: undefined,
            });
          }}
          onFilterChange={(filter: string) => {
            setState({
              ...state,
              filter,
            });
          }}
        />
      )}
      {renderContent()}
      <AddButton onPress={onAddPress} testID={ADD_BUTTON(testID)} />
    </MainView>
  );
};
