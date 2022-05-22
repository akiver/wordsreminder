import { useContext } from 'react';
import { ThemeContext } from '@theme/theme-context';

export const useToggleTheme = () => {
  const themeContext = useContext(ThemeContext);

  return themeContext.toggleTheme;
};
