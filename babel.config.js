module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@stacks': './src/stacks',
          '@screens': './src/screens',
          '@components': './src/components',
          '@constants': './src/constants',
          '@models': './src/models',
          '@auth': './src/auth',
          '@dictionaries': './src/dictionaries',
          '@settings': './src/settings',
          '@words': './src/words',
          '@theme': './src/theme',
          '@services': './src/services',
          '@utils': './src/utils',
          '@e2e': './e2e',
        },
      },
    ],
  ],
};
