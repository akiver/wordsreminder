import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import { WORDS_SCREEN } from '@constants/screens';
import { DICTIONARIES_ROW, DICTIONARIES_ROW_WORDS_COUNT, DICTIONARIES_ROW_UPDATED_AT } from '@e2e/ids';
import { DictionaryRow } from '../dictionary-row';
import { Dictionary } from '@models/dictionary';
import { ParamListBase } from '@react-navigation/native';

const push = jest.fn((path: string, params: ParamListBase) => path + params);
const navigation: any = { push };

jest.mock('@react-native-firebase/firestore', () => undefined);

describe('DictionaryRow', () => {
  const dictionaryMock: Dictionary = {
    id: 'id',
    name: 'a name',
    words: [],
    createdAt: null,
    updatedAt: null,
  };

  const renderComponent = (dictionary: Partial<Dictionary> | undefined = undefined) => {
    return render(
      <DictionaryRow
        navigation={navigation}
        testID={DICTIONARIES_ROW('id')}
        dictionary={{
          ...dictionaryMock,
          ...dictionary,
        }}
      />
    );
  };

  describe('interactions', () => {
    it('should navigate to the words screen on press', () => {
      const { getByTestId } = renderComponent();
      fireEvent.press(getByTestId(DICTIONARIES_ROW('id')));

      expect(push).toHaveBeenCalledWith(WORDS_SCREEN, {
        dictionary: dictionaryMock,
        title: dictionaryMock.name,
      });
    });
  });

  describe('render', () => {
    it('should render the dictionary name', () => {
      const { getByText } = renderComponent();
      getByText('a name');
    });

    it('should render the number of words in the dictionary', () => {
      const { getByTestId, getByText } = renderComponent({
        words: ['a word', 'two word'],
      });
      getByTestId(DICTIONARIES_ROW_WORDS_COUNT);
      getByText(/2 word\(s\)/i);
    });

    describe('without updated date', () => {
      it('should not render the update date', () => {
        const { queryByTestId } = renderComponent();
        expect(queryByTestId(DICTIONARIES_ROW_UPDATED_AT)).toBeNull();
      });
    });

    describe('with updated date', () => {
      it('should render the update date', () => {
        const date = new Date();
        const { getByTestId, queryByText } = renderComponent({
          updatedAt: {
            nanoseconds: 0,
            seconds: 0,
            isEqual: () => true,
            toMillis: () => 0,
            toDate: () => date,
          },
        });
        expect(getByTestId(DICTIONARIES_ROW_UPDATED_AT)).not.toBeNull();
        expect(getByTestId('clock-icon')).not.toBeNull();
        expect(queryByText(date.toLocaleDateString())).not.toBeNull();
      });
    });
  });
});
