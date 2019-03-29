import { expect, element, device, by } from 'detox'
import { signInUser } from '@e2e/navigation/sign-in-user'
import { createTestUser } from '@e2e/database/create-test-user'
import {
  TABNAV_SETTINGS_UNFOCUSED,
  SETTINGS_SCREEN,
  TABNAV_SETTINGS_FOCUSED,
  TABNAV_DICTIONARIES_UNFOCUSED,
} from '@e2e/ids'

describe('BottomBar navigation', () => {
  beforeAll(async () => {
    await createTestUser()
    await signInUser()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should navigate to the settings screen', async () => {
    await element(by.id(TABNAV_SETTINGS_UNFOCUSED)).tap()
    await expect(element(by.id(SETTINGS_SCREEN))).toBeVisible()
    await expect(element(by.id(TABNAV_SETTINGS_FOCUSED))).toBeVisible()
    await expect(element(by.id(TABNAV_DICTIONARIES_UNFOCUSED))).toBeVisible()
  })

  // It doesn't work, the tapping effect is visible in the simulator but navigation doesn't occurs.
  // TODO create issue on Detox? Maybe related to rn-svg or react-navigation.
  // it('should navigate to the dictionaries screen', async () => {
  //   await element(by.id('tabbar.settings.unfocused')).tap()
  //   await waitFor(element(by.id('settings.screen'))).toBeVisible()
  //   await element(by.id('tabbar.dictionaries.unfocused')).tap()
  //   await expect(element(by.id('dictionaries-screen'))).toBeVisible()
  //   await expect(element(by.id('tabbar.dictionaries.focused'))).toBeVisible()
  //   await expect(element(by.id('tabbar.settings.focused'))).toBeNotVisible()
  // })
})
