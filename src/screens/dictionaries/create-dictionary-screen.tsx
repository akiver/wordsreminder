import React from 'react'
import { InputText } from '@components/input-text'
import { createDictionary } from '@services/create-dictionary'
import {
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_ERROR,
  STATUS,
} from '@constants/statuses'
import { SaveButton } from '@components/save-button'
import { isStringEmpty } from '@utils/is-string-empty'
import { FormLayout } from '@components/form-layout'
import { View } from 'react-native'
import {
  DICTIONARY_CREATE_INPUT_NAME,
  DICTIONARY_CREATE_SCREEN,
} from '@e2e/ids'
import {
  PARAM_STATUS,
  PARAM_IS_SAVE_DISABLED,
  PARAM_ON_SAVE_PRESS,
} from '@constants/navigation-parameters'
import {
  NavigationScreenProps,
  NavigationScreenProp,
  NavigationScreenOptions,
} from 'react-navigation'

type Props = NavigationScreenProps
type State = typeof initialState

const initialState = Object.freeze({
  status: STATUS_IDLE as STATUS,
  name: '',
  error: undefined as string | undefined,
})

class CreateDictionaryScreen extends React.Component<Props, State> {
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<{}>
  }): NavigationScreenOptions => {
    const onSavePress: () => void | undefined = navigation.getParam(
      PARAM_ON_SAVE_PRESS
    )
    const isSaveButtonDisabled: boolean = navigation.getParam(
      PARAM_IS_SAVE_DISABLED
    )
    const status: STATUS = navigation.getParam(PARAM_STATUS)

    return {
      title: 'Add a dictionary',
      headerRight: onSavePress && (
        <SaveButton
          onPress={onSavePress}
          disabled={isSaveButtonDisabled}
          status={status}
        />
      ),
    }
  }

  readonly state = initialState

  componentDidMount() {
    this.props.navigation.setParams({
      [PARAM_ON_SAVE_PRESS]: this.handleSavePress,
      [PARAM_IS_SAVE_DISABLED]: true,
      [PARAM_STATUS]: this.state.status,
    })
  }

  handleNameChange = (name: string) => {
    this.setState(
      {
        name,
      },
      () => {
        this.props.navigation.setParams({
          [PARAM_IS_SAVE_DISABLED]: isStringEmpty(name),
        })
      }
    )
  }

  handleSavePress = async () => {
    this.setState(
      {
        status: STATUS_LOADING,
      },
      async () => {
        try {
          this.props.navigation.setParams({
            [PARAM_STATUS]: STATUS_LOADING,
          })
          await createDictionary(this.state.name)
          this.props.navigation.goBack()
        } catch (error) {
          this.setState(
            {
              status: STATUS_ERROR,
              error: error.message,
            },
            () => {
              this.props.navigation.setParams({
                [PARAM_STATUS]: STATUS_ERROR,
              })
            }
          )
        }
      }
    )
  }

  render() {
    return (
      <FormLayout status={this.state.status} error={this.state.error}>
        <View testID={DICTIONARY_CREATE_SCREEN}>
          <InputText
            label="Name"
            onChangeText={this.handleNameChange}
            onSubmitEditing={this.handleSavePress}
            returnKeyType="send"
            maxLength={40}
            autoFocus={true}
            placeholder="Dictionary's name"
            testID={DICTIONARY_CREATE_INPUT_NAME}
          />
        </View>
      </FormLayout>
    )
  }
}

export { CreateDictionaryScreen }
