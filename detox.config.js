module.exports = {
  'test-runner': 'jest',
  'runner-config': './e2e/jest.config.js',
  configurations: {
    'ios.sim.debug': {
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/WordsReminder.app',
      build:
        'xcodebuild -workspace ios/WordsReminder.xcworkspace -scheme WordsReminder -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      type: 'ios.simulator',
      device: {
        name: 'iPhone 11',
      },
    },
    'ios.sim.release': {
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/WordsReminder.app',
      build:
        'export RCT_NO_LAUNCH_PACKAGER=true && export RN_SRC_EXT=e2e.ts && xcodebuild -workspace ios/WordsReminder.xcworkspace -scheme WordsReminder -configuration Release -sdk iphonesimulator -derivedDataPath ios/build -quiet',
      type: 'ios.simulator',
      device: {
        name: 'iPhone 11',
      },
    },
    'android.emu.debug': {
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && export RN_SRC_EXT=e2e.ts && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd -',
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_2_API_28',
      },
    },
    'android.emu.release': {
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build:
        'cd android && export RN_SRC_EXT=e2e.ts && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release cd -',
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_2_API_28',
      },
    },
  },
};
