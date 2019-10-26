import React from 'react'
import { TextInput, View } from 'react-native'
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
import { isStringEmpty } from '@utils/is-string-empty'
import { updateWord } from '@services/update-word'
import { FormLayout } from '@components/form-layout'
import { Spacer } from '@components/spacer'
import {
  WORD_EDIT_SCREEN,
  WORD_EDIT_INPUT_VALUE,
  WORD_EDIT_INPUT_SIGNIFICATION,
  WORD_EDIT_INPUT_DESCRIPTION,
} from '@e2e/ids'
import {
  PARAM_WORD,
  PARAM_ON_SAVE_PRESS,
  PARAM_IS_SAVE_DISABLED,
  PARAM_STATUS,
} from '@constants/navigation-parameters'
import { Word } from '@models/word'

type Props = NavigationStackScreenProps
type State = ReturnType<typeof getInitialState>

const getInitialState = (props: Props) => {
  return Object.freeze({
    word: props.navigation.getParam(PARAM_WORD) as Word,
    status: STATUS_IDLE as STATUS,
    error: undefined as string | undefined,
  })
}

class EditWordScreen extends React.Component<Props, State> {
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
      title: 'Edit a word',
      headerRight: onSavePress && (
        <SaveButton
          disabled={isSaveDisabled}
          onPress={onSavePress}
          status={status}
        />
      ),
    }
  }

  significationRef: React.RefObject<TextInput> = React.createRef()

  descriptionRef: React.RefObject<TextInput> = React.createRef()

  INPUT_MARGIN_TOP = 10

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
        await updateWord(this.state.word)
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
    const { value, signification } = this.state.word
    this.props.navigation.setParams({
      [PARAM_IS_SAVE_DISABLED]:
        status === STATUS_LOADING ||
        isStringEmpty(value) ||
        isStringEmpty(signification),
    })
  }

  handleWordChange = (word: string) => {
    this.setState(
      prevState => ({
        word: {
          ...prevState.word,
          value: word,
        },
      }),
      () => {
        this.updateIsSaveDisabledParameter()
      }
    )
  }

  handleSignificationChange = (signification: string) => {
    this.setState(
      prevState => ({
        word: {
          ...prevState.word,
          signification,
        },
      }),
      () => {
        this.updateIsSaveDisabledParameter()
      }
    )
  }

  handleDescriptionChange = (description: string): void => {
    this.setState(prevState => ({
      word: {
        ...prevState.word,
        description,
      },
    }))
  }

  handleWordSubmitEditing = () => {
    if (this.significationRef.current !== null) {
      this.significationRef.current.focus()
    }
  }

  handleSignificationSubmitEditing = () => {
    if (this.descriptionRef.current !== null) {
      this.descriptionRef.current.focus()
    }
  }

  render() {
    const { value, signification, description } = this.state.word
    return (
      <FormLayout status={this.state.status} error={this.state.error}>
        <View testID={WORD_EDIT_SCREEN}>
          <InputText
            label="Word"
            placeholder="Word"
            onChangeText={this.handleWordChange}
            autoFocus={true}
            onSubmitEditing={this.handleWordSubmitEditing}
            returnKeyType="next"
            value={value}
            testID={WORD_EDIT_INPUT_VALUE}
          />
          <Spacer marginTop={this.INPUT_MARGIN_TOP}>
            <InputText
              label="Signification"
              placeholder="Word's signification"
              onChangeText={this.handleSignificationChange}
              ref={this.significationRef}
              returnKeyType="next"
              onSubmitEditing={this.handleSignificationSubmitEditing}
              value={signification}
              testID={WORD_EDIT_INPUT_SIGNIFICATION}
            />
          </Spacer>
          <Spacer marginTop={this.INPUT_MARGIN_TOP}>
            <InputText
              label="Description"
              placeholder="Write an optional word's description"
              onChangeText={this.handleDescriptionChange}
              multiline={true}
              ref={this.descriptionRef}
              value={description}
              testID={WORD_EDIT_INPUT_DESCRIPTION}
            />
          </Spacer>
        </View>
      </FormLayout>
    )
  }
}

export { EditWordScreen }
