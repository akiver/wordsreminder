import React from 'react'
import { View } from 'react-native'
import {
  NavigationStackScreenProps,
  NavigationStackProp,
  NavigationStackOptions,
} from 'react-navigation-stack'
import { InputText } from '@components/input-text'
import { SaveButton } from '@components/save-button'
import {
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_ERROR,
  STATUS,
} from '@constants/statuses'
import { updateDictionary } from '@services/update-dictionary'
import { isStringEmpty } from '@utils/is-string-empty'
import { FormLayout } from '@components/form-layout'
import { DICTIONARY_EDIT_SCREEN, DICTIONARY_EDIT_INPUT_NAME } from '@e2e/ids'
import {
  PARAM_DICTIONARY,
  PARAM_IS_SAVE_DISABLED,
  PARAM_STATUS,
  PARAM_ON_SAVE_PRESS,
} from '@constants/navigation-parameters'
import { Dictionary } from '@models/dictionary'

type Props = NavigationStackScreenProps
type State = ReturnType<typeof getInitialState>

const getInitialState = (props: Props) => {
  return Object.freeze({
    status: STATUS_IDLE as STATUS,
    dictionary: props.navigation.getParam(PARAM_DICTIONARY) as Dictionary,
    error: undefined as string | undefined,
  })
}

class EditDictionaryScreen extends React.Component<Props, State> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationStackProp
  }): NavigationStackOptions => {
    const onSavePress: () => void | undefined = navigation.getParam(
      PARAM_ON_SAVE_PRESS
    )
    const isSaveDisabled: boolean = navigation.getParam(PARAM_IS_SAVE_DISABLED)
    const status: STATUS = navigation.getParam(PARAM_STATUS)

    return {
      title: 'Edit a dictionary',
      headerRight: onSavePress && (
        <SaveButton
          disabled={isSaveDisabled}
          onPress={onSavePress}
          status={status}
        />
      ),
    }
  }

  readonly state = getInitialState(this.props)

  componentDidMount() {
    this.props.navigation.setParams({
      [PARAM_ON_SAVE_PRESS]: this.handleSavePress,
      [PARAM_STATUS]: this.state.status,
    })
  }

  handleSavePress = () => {
    this.setState({ status: STATUS_LOADING }, async () => {
      const { navigation } = this.props
      try {
        navigation.setParams({
          [PARAM_STATUS]: STATUS_LOADING,
        })
        await updateDictionary(this.state.dictionary)
        navigation.goBack()
      } catch (error) {
        this.setState({ status: STATUS_ERROR, error: error.message }, () => {
          navigation.setParams({
            [PARAM_STATUS]: STATUS_ERROR,
          })
        })
      }
    })
  }

  updateIsSaveDisabledParameter = () => {
    const { status } = this.state
    const { name } = this.state.dictionary
    this.props.navigation.setParams({
      [PARAM_IS_SAVE_DISABLED]:
        status === STATUS_LOADING || isStringEmpty(name),
    })
  }

  handleNameChange = (name: string) => {
    this.setState(
      prevState => ({
        dictionary: {
          ...prevState.dictionary,
          name,
        },
      }),
      () => {
        this.updateIsSaveDisabledParameter()
      }
    )
  }

  render() {
    return (
      <FormLayout status={this.state.status} error={this.state.error}>
        <View testID={DICTIONARY_EDIT_SCREEN}>
          <InputText
            label="Name"
            placeholder="Dictionary's name"
            onChangeText={this.handleNameChange}
            autoFocus={true}
            returnKeyType="done"
            value={this.state.dictionary.name}
            testID={DICTIONARY_EDIT_INPUT_NAME}
          />
        </View>
      </FormLayout>
    )
  }
}

export { EditDictionaryScreen }
