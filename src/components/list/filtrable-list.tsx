import React, { useState, useEffect, useCallback } from 'react';
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
import { useTheme } from '@theme/use-theme';
import { isFirestoreError } from '@services/firestore-error';

function compareUpdatedAt(entityA: Entity, entityB: Entity) {
  if (entityB.updatedAt == null || entityA.updatedAt == null) {
    return 0;
  }

  return entityB.updatedAt.toMillis() - entityA.updatedAt.toMillis();
}

type Props<EntityType extends Entity> = {
  query: FirebaseFirestoreTypes.Query;
  onAddPress: () => void;
  documentSnapshotToEntity: (doc: FirebaseFirestoreTypes.DocumentSnapshot) => EntityType;
  renderItem: ListRenderItem<EntityType>;
  emptyListMessage: string;
  filterEntities: (filter: string, entity: EntityType) => boolean;
  testID: string;
  onCloseFilter: () => void;
  hasFilterEnabled: boolean;
};

export function FiltrableList<EntityType extends Entity>({
  hasFilterEnabled,
  emptyListMessage,
  renderItem,
  documentSnapshotToEntity,
  query,
  testID,
  onAddPress,
  onCloseFilter,
  filterEntities,
}: Props<EntityType>) {
  const [status, setStatus] = useState<STATUS>(STATUS_LOADING);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [entities, setEntities] = useState<EntityType[]>([]);
  const theme = useTheme();

  const getEntitiesFromQuerySnapshot = useCallback(
    (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
      return querySnapshot.docs
        .map((doc) => {
          return documentSnapshotToEntity(doc);
        })
        .sort(compareUpdatedAt) as EntityType[];
    },
    [documentSnapshotToEntity]
  );

  useEffect(() => {
    const onCollectionUpdate = (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
      setStatus(STATUS_SUCCESS);
      setEntities(getEntitiesFromQuerySnapshot(querySnapshot));
    };

    const onCollectionError = (error: Error) => {
      const errorMessage = isFirestoreError(error) ? getErrorMessageFromFirestoreError(error) : error.message;
      setStatus(STATUS_ERROR);
      setError(errorMessage);
    };

    const unsubscribe = query.onSnapshot(onCollectionUpdate, onCollectionError);

    return () => {
      unsubscribe();
    };
  }, [getEntitiesFromQuerySnapshot, query]);

  const filterCurrentEntities = memoize((entities: EntityType[], filter?: string) => {
    let filteredEntities = entities;
    if (!isStringEmpty(filter)) {
      filteredEntities = entities.filter((entity) => {
        return filterEntities(filter as string, entity);
      });
    }

    return filteredEntities.sort(compareUpdatedAt);
  });

  const onCloseFilterPress = () => {
    setFilter(undefined);
    onCloseFilter();
  };

  const onFilterChange = (filter: string) => {
    setFilter(filter);
  };

  const renderContent = () => {
    if (status === STATUS_LOADING) {
      return <ActivityIndicator />;
    }

    if (status === STATUS_ERROR) {
      return <ErrorMessage message={error} />;
    }

    const filteredEntities = filterCurrentEntities(entities, filter);
    if (filteredEntities.length === 0) {
      return (
        <Spacer marginTop={10} marginLeft={10} marginRight={10}>
          <Text testID={EMPTY_LIST_MESSAGE} color="primary025" fontSize={20}>
            {emptyListMessage}
          </Text>
        </Spacer>
      );
    }

    const onRefresh = async () => {
      try {
        setIsRefreshing(true);
        const querySnapShot = await query.get();
        setStatus(STATUS_SUCCESS);
        setEntities(getEntitiesFromQuerySnapshot(querySnapShot));
      } catch (error) {
        setStatus(STATUS_ERROR);
        let errorMessage: string;
        if (isFirestoreError(error)) {
          errorMessage = getErrorMessageFromFirestoreError(error);
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'An error occurred';
        }
        setError(errorMessage);
      } finally {
        setIsRefreshing(false);
      }
    };

    return (
      <FlatList
        data={filteredEntities}
        renderItem={renderItem}
        keyExtractor={(entity: EntityType) => entity.id}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={theme.primary025} />}
      />
    );
  };

  return (
    <MainView testID={testID}>
      {hasFilterEnabled && <FilterBar onCloseFilterPress={onCloseFilterPress} onFilterChange={onFilterChange} />}
      {renderContent()}
      <AddButton onPress={onAddPress} testID={ADD_BUTTON(testID)} />
    </MainView>
  );
}
