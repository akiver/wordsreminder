import React from 'react';
import { TextInput, View } from 'react-native';
import { InputText } from '@components/input-text';
import { SaveButton } from '@components/save-button';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { isStringEmpty } from '@utils/is-string-empty';
import { updateWord } from '@services/update-word';
import { FormLayout } from '@components/form-layout';
import { Spacer } from '@components/spacer';
import {
  WORD_EDIT_SCREEN,
  WORD_EDIT_INPUT_VALUE,
  WORD_EDIT_INPUT_SIGNIFICATION,
  WORD_EDIT_INPUT_DESCRIPTION,
} from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';
import { RouteProp } from '@react-navigation/native';
import { WORDS_EDIT_SCREEN } from '@constants/screens';

type EditWordScreenNavigationProps = StackNavigationProp<DictionariesStackParamList, typeof WORDS_EDIT_SCREEN>;
type EditWordScreenRouteProps = RouteProp<DictionariesStackParamList, typeof WORDS_EDIT_SCREEN>;

type Props = {
  navigation: EditWordScreenNavigationProps;
  route: EditWordScreenRouteProps;
};

type State = ReturnType<typeof getInitialState>;

const getInitialState = (props: Props) => {
  return Object.freeze({
    word: props.route.params.word,
    status: STATUS_IDLE as STATUS,
    error: undefined as string | undefined,
  });
};

export class EditWordScreen extends React.Component<Props, State> {
  significationRef: React.RefObject<TextInput> = React.createRef();

  descriptionRef: React.RefObject<TextInput> = React.createRef();

  INPUT_MARGIN_TOP = 10;

  readonly state = getInitialState(this.props);

  componentDidMount() {
    this.updateSaveButton();
  }

  private updateSaveButton = () => {
    this.props.navigation.setOptions({
      headerRight: () => {
        const { status, word } = this.state;
        const { value, signification } = word;
        return (
          <SaveButton
            disabled={status === STATUS_LOADING || isStringEmpty(value) || isStringEmpty(signification)}
            onPress={this.handleSavePress}
            status={status}
          />
        );
      },
    });
  };

  handleSavePress = () => {
    this.setState({ status: STATUS_LOADING }, async () => {
      const { navigation } = this.props;
      try {
        this.updateSaveButton();
        await updateWord(this.state.word);
        navigation.goBack();
      } catch (error) {
        this.setState({ status: STATUS_ERROR, error: error.message }, () => {
          this.updateSaveButton();
        });
      }
    });
  };

  handleWordChange = (word: string) => {
    this.setState(
      (prevState) => ({
        word: {
          ...prevState.word,
          value: word,
        },
      }),
      () => {
        this.updateSaveButton();
      }
    );
  };

  handleSignificationChange = (signification: string) => {
    this.setState(
      (prevState) => ({
        word: {
          ...prevState.word,
          signification,
        },
      }),
      () => {
        this.updateSaveButton();
      }
    );
  };

  handleDescriptionChange = (description: string): void => {
    this.setState((prevState) => ({
      word: {
        ...prevState.word,
        description,
      },
    }));
  };

  handleWordSubmitEditing = () => {
    if (this.significationRef.current !== null) {
      this.significationRef.current.focus();
    }
  };

  handleSignificationSubmitEditing = () => {
    if (this.descriptionRef.current !== null) {
      this.descriptionRef.current.focus();
    }
  };

  render() {
    const { value, signification, description } = this.state.word;
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
    );
  }
}
