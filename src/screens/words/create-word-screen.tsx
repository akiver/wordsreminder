import React from 'react'
import { TextInput, View } from 'react-native'
import { NavigationStackScreenProps, NavigationStackOptions, NavigationStackProp } from 'react-navigation-stack'
import { InputText } from '@components/input-text'
import { SaveButton } from '@components/save-button'
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses'
import { createWord } from '@services/create-word'
import { isStringEmpty } from '@utils/is-string-empty'
import { FormLayout } from '@components/form-layout'
import { Spacer } from '@components/spacer'
import {
  WORD_CREATE_SCREEN,
  WORD_CREATE_INPUT_VALUE,
  WORD_CREATE_INPUT_SIGNIFICATION,
  WORD_CREATE_INPUT_DESCRIPTION,
} from '@e2e/ids'
import {
  PARAM_ON_SAVE_PRESS,
  PARAM_IS_SAVE_DISABLED,
  PARAM_STATUS,
  PARAM_DICTIONARY_ID,
} from '@constants/navigation-parameters'

type Props = NavigationStackScreenProps
type State = typeof initialState

const initialState = Object.freeze({
  value: undefined as string | undefined,
  signification: undefined as string | undefined,
  description: undefined as string | undefined,
  status: STATUS_IDLE as STATUS,
  error: undefined as string | undefined,
})

class CreateWordScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: NavigationStackProp }): NavigationStackOptions => {
    const onSavePress: () => void | undefined = navigation.getParam(PARAM_ON_SAVE_PRESS)
    const isSaveDisabled: boolean = navigation.getParam(PARAM_IS_SAVE_DISABLED)
    const status: STATUS = navigation.getParam(PARAM_STATUS)
    return {
      title: 'Add a word',
      headerRight: onSavePress && <SaveButton disabled={isSaveDisabled} onPress={onSavePress} status={status} />,
    }
  }

  significationRef: React.RefObject<TextInput> = React.createRef()

  descriptionRef: React.RefObject<TextInput> = React.createRef()

  readonly state = initialState

  INPUT_MARGIN_TOP = 10

  componentDidMount() {
    this.props.navigation.setParams({
      [PARAM_ON_SAVE_PRESS]: this.handleAddPress,
      [PARAM_STATUS]: this.state.status,
      [PARAM_IS_SAVE_DISABLED]: true,
    })
  }

  handleAddPress = () => {
    this.setState({ status: STATUS_LOADING }, async () => {
      const { navigation } = this.props
      try {
        navigation.setParams({
          [PARAM_STATUS]: STATUS_LOADING,
        })

        const dictionaryId: string = navigation.getParam(PARAM_DICTIONARY_ID)
        const { value, signification, description } = this.state
        await createWord(dictionaryId, value, signification, description)
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
    const { value, signification, status } = this.state
    this.props.navigation.setParams({
      [PARAM_IS_SAVE_DISABLED]: status === STATUS_LOADING || isStringEmpty(value) || isStringEmpty(signification),
    })
  }

  handleWordChange = (word: string) => {
    this.setState(
      {
        value: word,
      },
      () => {
        this.updateIsSaveDisabledParameter()
      }
    )
  }

  handleSignificationChange = (signification: string) => {
    this.setState(
      {
        signification,
      },
      () => {
        this.updateIsSaveDisabledParameter()
      }
    )
  }

  handleDescriptionChange = (description: string): void => {
    this.setState({
      description,
    })
  }

  handleWordSubmitEditing = () => {
    const signification = this.significationRef.current
    if (signification !== null) {
      signification.focus()
    }
  }

  handleSignificationSubmitEditing = () => {
    const description = this.descriptionRef.current
    if (description !== null) {
      description.focus()
    }
  }

  render() {
    return (
      <FormLayout status={this.state.status} error={this.state.error}>
        <View testID={WORD_CREATE_SCREEN}>
          <InputText
            label="Word"
            placeholder="Word"
            onChangeText={this.handleWordChange}
            autoFocus={true}
            onSubmitEditing={this.handleWordSubmitEditing}
            returnKeyType="next"
            testID={WORD_CREATE_INPUT_VALUE}
          />
          <Spacer marginTop={this.INPUT_MARGIN_TOP}>
            <InputText
              label="Signification"
              placeholder="Word's signification"
              onChangeText={this.handleSignificationChange}
              ref={this.significationRef}
              returnKeyType="next"
              onSubmitEditing={this.handleSignificationSubmitEditing}
              testID={WORD_CREATE_INPUT_SIGNIFICATION}
            />
          </Spacer>
          <Spacer marginTop={this.INPUT_MARGIN_TOP}>
            <InputText
              label="Description"
              placeholder="Write an optional word's description"
              onChangeText={this.handleDescriptionChange}
              multiline={true}
              ref={this.descriptionRef}
              testID={WORD_CREATE_INPUT_DESCRIPTION}
            />
          </Spacer>
        </View>
      </FormLayout>
    )
  }
}

export { CreateWordScreen }
