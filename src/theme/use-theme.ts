import { useContext } from 'react';
import { ThemeContext } from '@theme/theme-context';

export function useTheme() {
  const themeContext = useContext(ThemeContext);

  return themeContext.theme;
}
