import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@theme/use-theme';

export function PlusIcon() {
  const theme = useTheme();

  return (
    <Svg width={56} height={56} viewBox="0 0 510 510" testID="plus-icon">
      <Path
        fill={theme.primary025}
        d="M280.5 127.5h-51v102h-102v51h102v102h51v-102h102v-51h-102v-102zM255 0C114.75 0 0 114.75 0 255s114.75 255 255 255 255-114.75 255-255S395.25 0 255 0zm0 459c-112.2 0-204-91.8-204-204S142.8 51 255 51s204 91.8 204 204-91.8 204-204 204z"
      />
    </Svg>
  );
}
