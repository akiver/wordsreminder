import React from 'react';
import { TextInput, View } from 'react-native';
import { InputText } from '@components/input-text';
import { SaveButton } from '@components/save-button';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { createWord } from '@services/create-word';
import { isStringEmpty } from '@utils/is-string-empty';
import { FormLayout } from '@components/form-layout';
import { Spacer } from '@components/spacer';
import {
  WORD_CREATE_SCREEN,
  WORD_CREATE_INPUT_VALUE,
  WORD_CREATE_INPUT_SIGNIFICATION,
  WORD_CREATE_INPUT_DESCRIPTION,
} from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';
import { RouteProp } from '@react-navigation/native';
import { WORDS_CREATE_SCREEN } from '@constants/screens';

type CreateWordScreenNavigationProps = StackNavigationProp<DictionariesStackParamList, typeof WORDS_CREATE_SCREEN>;
type CreateWordScreenRouteProps = RouteProp<DictionariesStackParamList, typeof WORDS_CREATE_SCREEN>;

type Props = {
  navigation: CreateWordScreenNavigationProps;
  route: CreateWordScreenRouteProps;
};

type State = typeof initialState;

const initialState = Object.freeze({
  value: undefined as string | undefined,
  signification: undefined as string | undefined,
  description: undefined as string | undefined,
  status: STATUS_IDLE as STATUS,
  error: undefined as string | undefined,
});

export class CreateWordScreen extends React.Component<Props, State> {
  significationRef: React.RefObject<TextInput> = React.createRef();

  descriptionRef: React.RefObject<TextInput> = React.createRef();

  readonly state = initialState;

  INPUT_MARGIN_TOP = 10;

  componentDidMount() {
    this.props.navigation.setOptions({
      title: 'Add a word',
    });
    this.updateSaveButton();
  }

  updateSaveButton = () => {
    this.props.navigation.setOptions({
      headerRight: () => {
        const { status, signification, value } = this.state;
        return (
          <SaveButton
            disabled={status === STATUS_LOADING || isStringEmpty(value) || isStringEmpty(signification)}
            onPress={this.handleAddPress}
            status={status}
          />
        );
      },
    });
  };

  handleAddPress = () => {
    this.setState({ status: STATUS_LOADING }, async () => {
      const { navigation, route } = this.props;
      try {
        this.updateSaveButton();
        const dictionaryId: string = route.params.dictionaryId;
        const { value, signification, description } = this.state;
        await createWord(dictionaryId, value, signification, description);
        navigation.goBack();
      } catch (error) {
        this.setState({ status: STATUS_ERROR, error: error.message }, () => {
          this.setState({
            status: STATUS_ERROR,
          });
        });
      }
    });
  };

  handleWordChange = (word: string) => {
    this.setState(
      {
        value: word,
      },
      () => {
        this.updateSaveButton();
      }
    );
  };

  handleSignificationChange = (signification: string) => {
    this.setState(
      {
        signification,
      },
      () => {
        this.updateSaveButton();
      }
    );
  };

  handleDescriptionChange = (description: string): void => {
    this.setState({
      description,
    });
  };

  handleWordSubmitEditing = () => {
    const signification = this.significationRef.current;
    if (signification !== null) {
      signification.focus();
    }
  };

  handleSignificationSubmitEditing = () => {
    const description = this.descriptionRef.current;
    if (description !== null) {
      description.focus();
    }
  };

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
    );
  }
}
