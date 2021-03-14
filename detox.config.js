module.exports = {
  'test-runner': 'jest',
  'runner-config': './e2e/jest.config.js',
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 12',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_2_API_29',
      },
    },
  },
  apps: {
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/WordsReminder.app',
      build:
        'export RCT_NO_LAUNCH_PACKAGER=true && export RN_SRC_EXT=e2e.ts && xcodebuild -workspace ios/WordsReminder.xcworkspace -scheme WordsReminder -configuration Release -sdk iphonesimulator -derivedDataPath ios/build -quiet',
    },
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/WordsReminder.app',
      build:
        'xcodebuild -workspace ios/WordsReminder.xcworkspace -scheme WordsReminder -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && export RN_SRC_EXT=e2e.ts && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd -',
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build:
        'cd android && export RN_SRC_EXT=e2e.ts && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release cd -',
    },
  },
  configurations: {
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
  },
};
