import { expect, element, device, by, waitFor } from 'detox';
import { signInUser } from '@e2e/navigation/sign-in-user';
import { createTestUser } from '@e2e/database/create-test-user';
import { TABNAV_SETTINGS_UNFOCUSED, SETTINGS_SCREEN_ID, SETTINGS_SIGNOUT_BUTTON, SIGNIN_SCREEN } from '@e2e/ids';

describe('SignOut', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true, newInstance: true });
    await createTestUser();
  });

  it('should sign out the user', async () => {
    await signInUser();
    await waitFor(element(by.id(TABNAV_SETTINGS_UNFOCUSED))).toBeVisible();
    await element(by.id(TABNAV_SETTINGS_UNFOCUSED)).tap();
    await expect(element(by.id(SETTINGS_SCREEN_ID))).toBeVisible();
    await element(by.id(SETTINGS_SIGNOUT_BUTTON)).tap();
    await expect(element(by.id(SIGNIN_SCREEN))).toBeVisible();
  });
});
