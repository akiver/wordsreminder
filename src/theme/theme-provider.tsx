import React, { useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from 'react-native-bootsplash';
import { themes, ThemeContext, Themes } from '@theme/theme-context';
import { THEME_DARK_VALUE, THEME_KEY, THEME_LIGHT_VALUE } from '@constants/async-storage';

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState(themes.dark);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await AsyncStorage.getItem(THEME_KEY);

        if (theme !== null) {
          setTheme(themes[theme as keyof Themes]);
        }
      } catch (error) {
        // Unable to load theme, just skip it, dark theme will be used.
      } finally {
        RNBootSplash.hide();
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    await AsyncStorage.setItem(THEME_KEY, theme === themes.dark ? THEME_LIGHT_VALUE : THEME_DARK_VALUE);
    setTheme(theme === themes.dark ? themes.light : themes.dark);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
