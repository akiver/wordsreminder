import React from 'react';
import { InputText } from '@components/input-text';
import { createDictionary } from '@services/create-dictionary';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { SaveButton } from '@components/save-button';
import { isStringEmpty } from '@utils/is-string-empty';
import { FormLayout } from '@components/form-layout';
import { View } from 'react-native';
import { DICTIONARY_CREATE_INPUT_NAME, DICTIONARY_CREATE_SCREEN_ID } from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';
import { RouteProp } from '@react-navigation/native';
import { DICTIONARIES_CREATE_SCREEN } from '@constants/screens';

type CreateDictionaryScreenNavigationProps = StackNavigationProp<
  DictionariesStackParamList,
  typeof DICTIONARIES_CREATE_SCREEN
>;
type CreateDictionaryScreenRouteProps = RouteProp<DictionariesStackParamList, typeof DICTIONARIES_CREATE_SCREEN>;

type Props = {
  navigation: CreateDictionaryScreenNavigationProps;
  route: CreateDictionaryScreenRouteProps;
};

type State = typeof initialState;

const initialState = Object.freeze({
  status: STATUS_IDLE as STATUS,
  name: '',
  error: undefined as string | undefined,
});

export class CreateDictionaryScreen extends React.Component<Props, State> {
  readonly state = initialState;

  public componentDidMount() {
    this.updateSaveButton();
  }

  private updateSaveButton = () => {
    this.props.navigation.setOptions({
      headerRight: () => {
        const { status, name } = this.state;
        return (
          <SaveButton
            onPress={this.handleSavePress}
            disabled={status === STATUS_LOADING || isStringEmpty(name)}
            status={status}
          />
        );
      },
    });
  };

  private handleNameChange = (name: string) => {
    this.setState(
      {
        name,
      },
      () => {
        this.updateSaveButton();
      }
    );
  };

  private handleSavePress = async () => {
    this.setState(
      {
        status: STATUS_LOADING,
      },
      async () => {
        try {
          this.updateSaveButton();
          await createDictionary(this.state.name);
          this.props.navigation.goBack();
        } catch (error) {
          this.setState(
            {
              status: STATUS_ERROR,
              error: error.message,
            },
            () => {
              this.updateSaveButton();
            }
          );
        }
      }
    );
  };

  public render() {
    return (
      <FormLayout status={this.state.status} error={this.state.error}>
        <View testID={DICTIONARY_CREATE_SCREEN_ID}>
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
    );
  }
}
