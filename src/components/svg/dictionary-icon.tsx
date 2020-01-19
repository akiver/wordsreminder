import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  focused: boolean;
  color: string;
};

export const DictionaryIcon = ({ color }: Props) => {
  return (
    <Svg height={28} width={28} viewBox="0 0 24 24" fill={color}>
      <Path d="M0 0h24v24H0z" fill="none" />
      <Path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
    </Svg>
  );
};
