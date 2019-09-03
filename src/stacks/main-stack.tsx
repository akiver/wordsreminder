import React from 'react'
import { NavigationScreenConfigProps } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import {
  createBottomTabNavigator,
  TabBarIconProps,
} from 'react-navigation-tabs'
import { DictionariesScreen } from '@screens/dictionaries/dictionaries-screen'
import { CreateDictionaryScreen } from '@screens/dictionaries/create-dictionary-screen'
import { EditDictionaryScreen } from '@screens/dictionaries/edit-dictionary-screen'
import { WordsScreen } from '@screens/words/words-screen'
import { CreateWordScreen } from '@screens/words/create-word-screen'
import { EditWordScreen } from '@screens/words/edit-word-screen'
import { defaultNavigationOptions } from '@utils/default-navigation-options'
import {
  DICTIONARIES_SCREEN,
  DICTIONARIES_CREATE_SCREEN,
  DICTIONARIES_EDIT_SCREEN,
  WORDS_SCREEN,
  WORDS_CREATE_SCREEN,
  WORDS_EDIT_SCREEN,
  SETTINGS_SCREEN,
  SETTINGS_TURN_OFF_PASSCODE_SCREEN,
  SETTINGS_TURN_ON_PASSCODE_SCREEN,
} from '@constants/screens'
import { SettingsScreen } from '@screens/settings/settings-screen'
import { TurnOffPasscodeScreen } from '@screens/settings/turn-off-passcode'
import { TurnOnPasscodeScreen } from '@screens/settings/turn-on-passcode'
import { SettingsIcon } from '@components/svg/settings-icon'
import { DictionaryIcon } from '@components/svg/dictionary-icon'
import {
  TABNAV_DICTIONARIES_FOCUSED,
  TABNAV_DICTIONARIES_UNFOCUSED,
  TABNAV_SETTINGS_FOCUSED,
  TABNAV_SETTINGS_UNFOCUSED,
} from '@e2e/ids'
import { Theme } from '@contexts/theme-context'

const MainStack = createBottomTabNavigator(
  {
    [DICTIONARIES_SCREEN]: createStackNavigator(
      {
        [DICTIONARIES_SCREEN]: DictionariesScreen,
        [DICTIONARIES_CREATE_SCREEN]: CreateDictionaryScreen,
        [DICTIONARIES_EDIT_SCREEN]: EditDictionaryScreen,
        [WORDS_SCREEN]: WordsScreen,
        [WORDS_CREATE_SCREEN]: CreateWordScreen,
        [WORDS_EDIT_SCREEN]: EditWordScreen,
      },
      {
        defaultNavigationOptions,
      }
    ),
    [SETTINGS_SCREEN]: createStackNavigator(
      {
        [SETTINGS_SCREEN]: SettingsScreen,
        [SETTINGS_TURN_OFF_PASSCODE_SCREEN]: TurnOffPasscodeScreen,
        [SETTINGS_TURN_ON_PASSCODE_SCREEN]: TurnOnPasscodeScreen,
      },
      {
        navigationOptions: ({ navigation }: NavigationScreenConfigProps) => {
          const isPasscodeScreen = navigation.state.routes.some(
            route =>
              route.routeName === SETTINGS_TURN_ON_PASSCODE_SCREEN ||
              route.routeName === SETTINGS_TURN_OFF_PASSCODE_SCREEN
          )
          return {
            tabBarVisible: !isPasscodeScreen,
          }
        },
        defaultNavigationOptions,
        mode: 'modal',
      }
    ),
  },
  {
    defaultNavigationOptions: ({
      navigation,
      screenProps,
    }: NavigationScreenConfigProps) => {
      const theme = screenProps.theme as Theme
      return {
        tabBarOptions: {
          style: {
            backgroundColor: theme.primary100,
          },
          showLabel: false,
        },
        tabBarIcon: function TabBarIcon({ focused }: TabBarIconProps) {
          const { routeName } = navigation.state
          const opacity = focused ? 1 : 0.5
          if (routeName === DICTIONARIES_SCREEN) {
            return (
              <DictionaryIcon
                opacity={opacity}
                testID={
                  // react-navigation create 2 layers and hide / show the right one depending of the focus state.
                  // We have to use 2 testIDs to find the right one during e2e tests.
                  focused
                    ? TABNAV_DICTIONARIES_FOCUSED
                    : TABNAV_DICTIONARIES_UNFOCUSED
                }
              />
            )
          }

          return (
            <SettingsIcon
              opacity={opacity}
              testID={
                focused ? TABNAV_SETTINGS_FOCUSED : TABNAV_SETTINGS_UNFOCUSED
              }
            />
          )
        },
      }
    },
  }
)

export { MainStack }
