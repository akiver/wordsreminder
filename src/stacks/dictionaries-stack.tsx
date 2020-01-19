import React from 'react';
import { DictionariesScreen } from '@screens/dictionaries/dictionaries-screen';
import { CreateDictionaryScreen } from '@screens/dictionaries/create-dictionary-screen';
import { EditDictionaryScreen } from '@screens/dictionaries/edit-dictionary-screen';
import { WordsScreen } from '@screens/words/words-screen';
import { CreateWordScreen } from '@screens/words/create-word-screen';
import { EditWordScreen } from '@screens/words/edit-word-screen';
import {
  DICTIONARIES_SCREEN,
  DICTIONARIES_CREATE_SCREEN,
  DICTIONARIES_EDIT_SCREEN,
  WORDS_SCREEN,
  WORDS_CREATE_SCREEN,
  WORDS_EDIT_SCREEN,
} from '@constants/screens';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@hooks/use-theme';
import {
  PARAM_SCREEN_TITLE,
  PARAM_DICTIONARY,
  PARAM_DICTIONARY_ID,
  PARAM_WORD,
} from '@constants/navigation-parameters';
import { Dictionary } from '@models/dictionary';
import { Word } from '@models/word';

export type DictionariesStackParamList = {
  [DICTIONARIES_SCREEN]: undefined;
  [DICTIONARIES_CREATE_SCREEN]: undefined;
  [DICTIONARIES_EDIT_SCREEN]: { [PARAM_DICTIONARY]: Dictionary };
  [WORDS_SCREEN]: { [PARAM_SCREEN_TITLE]: string; [PARAM_DICTIONARY]: Dictionary };
  [WORDS_CREATE_SCREEN]: { [PARAM_DICTIONARY_ID]: string };
  [WORDS_EDIT_SCREEN]: { [PARAM_WORD]: Word };
};

const Stack = createStackNavigator<DictionariesStackParamList>();

export const DictionariesStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName={DICTIONARIES_SCREEN}
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: theme.primary100,
        },
        headerTintColor: theme.white,
      }}
    >
      <Stack.Screen name={DICTIONARIES_SCREEN} component={DictionariesScreen} />
      <Stack.Screen
        name={DICTIONARIES_CREATE_SCREEN}
        component={CreateDictionaryScreen}
        options={{
          title: 'Add a dictionary',
        }}
      />
      <Stack.Screen
        name={DICTIONARIES_EDIT_SCREEN}
        component={EditDictionaryScreen}
        options={{
          title: 'Edit a dictionary',
        }}
      />
      <Stack.Screen name={WORDS_SCREEN} component={WordsScreen} />
      <Stack.Screen name={WORDS_CREATE_SCREEN} component={CreateWordScreen} />
      <Stack.Screen
        name={WORDS_EDIT_SCREEN}
        component={EditWordScreen}
        options={{
          title: 'Edit a word',
        }}
      />
    </Stack.Navigator>
  );
};
