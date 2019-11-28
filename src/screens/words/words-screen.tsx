import React from 'react'
import { firestore } from 'react-native-firebase'
import { Query } from 'react-native-firebase/firestore'
import { WORDS } from '@constants/database'
import { WORDS_CREATE_SCREEN } from '@constants/screens'
import { documentSnapshotToWord, Word } from '@models/word'
import { WordRow } from '@words/word-row'
import { FiltrableList } from '@components/list/filtrable-list'
import { WORDS_ROW, WORDS_SCREEN } from '@e2e/ids'
import { FilterOpenButton } from '@components/filter-open-button'
import {
  PARAM_DICTIONARY,
  PARAM_SCREEN_TITLE,
  PARAM_HAS_FILTER_ENABLED,
  PARAM_DICTIONARY_ID,
} from '@constants/navigation-parameters'
import { NavigationStackScreenProps, NavigationStackProp, NavigationStackOptions } from 'react-navigation-stack'

type Props = NavigationStackScreenProps

class WordsScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationStackProp }): NavigationStackOptions => {
    const { params } = navigation.state
    const options: NavigationStackOptions = {
      title: navigation.getParam(PARAM_SCREEN_TITLE),
    }

    const hasFilterEnabled = navigation.getParam(PARAM_HAS_FILTER_ENABLED)
    if (params && hasFilterEnabled) {
      return {
        ...options,
        // Remove the header to make space for the search bar.
        header: null,
      }
    }

    const onOpenFilterPress = () => navigation.setParams({ [PARAM_HAS_FILTER_ENABLED]: true })
    return {
      ...options,
      headerRight: <FilterOpenButton onPress={onOpenFilterPress} />,
    }
  }

  query: Query = firestore()
    .collection(WORDS)
    .where('dictionary', '==', this.props.navigation.getParam(PARAM_DICTIONARY).id)
  // Throw an error :/
  // https://github.com/invertase/react-native-firebase/issues/1437
  // .orderBy('updatedAt', 'desc')

  filterWords(filter: string, word: Word) {
    return (
      word.value.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
      word.signification.toLowerCase().indexOf(filter.toLowerCase()) > -1
    )
  }

  handleAddWordPress = () => {
    const { navigation } = this.props
    navigation.push(WORDS_CREATE_SCREEN, {
      [PARAM_DICTIONARY_ID]: navigation.getParam(PARAM_DICTIONARY).id,
    })
  }

  renderWord = ({ item }: { item: Word }) => {
    return <WordRow word={item} navigation={this.props.navigation} testID={WORDS_ROW(item.id)} />
  }

  render() {
    return (
      <FiltrableList
        query={this.query}
        renderItem={this.renderWord}
        documentSnapshotToEntity={documentSnapshotToWord}
        onAddPress={this.handleAddWordPress}
        emptyListMessage="Press the add button to add a new word."
        testID={WORDS_SCREEN}
        filterEntities={this.filterWords}
        navigation={this.props.navigation}
      />
    )
  }
}

export { WordsScreen }
