import React from 'react';
import { View } from 'react-native';
import { InputText } from '@components/input-text';
import { SaveButton } from '@components/save-button';
import { STATUS_IDLE, STATUS_LOADING, STATUS_ERROR, STATUS } from '@constants/statuses';
import { updateDictionary } from '@services/update-dictionary';
import { isStringEmpty } from '@utils/is-string-empty';
import { FormLayout } from '@components/form-layout';
import { DICTIONARY_EDIT_SCREEN_ID, DICTIONARY_EDIT_INPUT_NAME } from '@e2e/ids';
import { StackNavigationProp } from '@react-navigation/stack';
import { DictionariesStackParamList } from '@stacks/dictionaries-stack';
import { RouteProp } from '@react-navigation/native';
import { DICTIONARIES_EDIT_SCREEN } from '@constants/screens';

type EditDictionaryScreenNavigationProps = StackNavigationProp<
  DictionariesStackParamList,
  typeof DICTIONARIES_EDIT_SCREEN
>;
type EditDictionaryScreenRouteProps = RouteProp<DictionariesStackParamList, typeof DICTIONARIES_EDIT_SCREEN>;

type Props = {
  navigation: EditDictionaryScreenNavigationProps;
  route: EditDictionaryScreenRouteProps;
};

type State = ReturnType<typeof getInitialState>;

const getInitialState = (props: Props) => {
  return Object.freeze({
    status: STATUS_IDLE as STATUS,
    dictionary: props.route.params.dictionary,
    error: undefined as string | undefined,
  });
};

export class EditDictionaryScreen extends React.Component<Props, State> {
  readonly state = getInitialState(this.props);

  public componentDidMount() {
    this.updateSaveButton();
  }

  private updateSaveButton = () => {
    this.props.navigation.setOptions({
      headerRight: () => {
        const { status, dictionary } = this.state;
        const { name } = dictionary;
        return (
          <SaveButton
            disabled={status === STATUS_LOADING || isStringEmpty(name)}
            onPress={this.handleSavePress}
            status={status}
          />
        );
      },
    });
  };

  private handleSavePress = () => {
    this.setState({ status: STATUS_LOADING }, async () => {
      const { navigation } = this.props;
      try {
        this.updateSaveButton();
        await updateDictionary(this.state.dictionary);
        navigation.goBack();
      } catch (error) {
        this.setState({ status: STATUS_ERROR, error: error.message }, () => {
          this.updateSaveButton();
        });
      }
    });
  };

  private handleNameChange = (name: string) => {
    this.setState(
      (prevState) => ({
        dictionary: {
          ...prevState.dictionary,
          name,
        },
      }),
      () => {
        this.updateSaveButton();
      }
    );
  };

  public render() {
    return (
      <FormLayout status={this.state.status} error={this.state.error}>
        <View testID={DICTIONARY_EDIT_SCREEN_ID}>
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
    );
  }
}
