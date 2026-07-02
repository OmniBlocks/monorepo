import { test, expect } from '@playwright/test';

test('OmniBlocks Test', async ({ page }) => {
  // 1. Navigate to landing page
  await page.goto('http://localhost:8601/');
  await page.screenshot({ path: 'screenshots/01-landing-page.png' });

  // 2. Open the editor
  await page.getByRole('button', { name: 'See inside' }).click();
  await page.screenshot({ path: 'screenshots/02-after-see-inside.png' });

  // 3. Asset Tabs Navigation
  await page.getByRole('tab', { name: 'Costumes' }).click();
  await page.screenshot({ path: 'screenshots/03-tab-costumes.png' });

  await page.getByRole('tab', { name: 'Sounds' }).click();
  await page.screenshot({ path: 'screenshots/04-tab-sounds.png' });

  await page.getByRole('tab', { name: 'Songs' }).click();
  await page.screenshot({ path: 'screenshots/05-tab-songs.png' });

  // 4. Variable Manager & Full Stage Toggles
  await page.locator('#react-tabs-sa-variable-manager').click();
  await page.screenshot({ path: 'screenshots/06-variable-manager.png' });

  await page.getByRole('button', { name: 'Switch to full stage' }).nth(1).click();
  await page.screenshot({ path: 'screenshots/07-full-stage-mode.png' });

  await page.getByRole('button', { name: 'Exit full screen mode' }).click();
  await page.screenshot({ path: 'screenshots/08-exit-full-screen.png' });

  // 5. Change Project Title
  const titleInput = page.getByRole('textbox', { name: 'Project title here' });
  await titleInput.fill('Change Title');
  await page.screenshot({ path: 'screenshots/09-title-typed.png' });

  await titleInput.press('Enter');
  await page.screenshot({ path: 'screenshots/10-title-submitted.png' });

  // 6. Record Modal Operations (Skipping intermediate format selections)
  await page.getByText('Record').click();
  await page.screenshot({ path: 'screenshots/11-record-modal-opened.png' });

  await page.getByLabel('Format').selectOption('ogg'); 
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.screenshot({ path: 'screenshots/12-record-modal-cancelled.png' });

  // 7. Start Recording Execution
  await page.locator('.sa-record-icon').click();
  await page.screenshot({ path: 'screenshots/13-record-icon-clicked.png' });

  await page.getByRole('button', { name: 'Start' }).click();
  await page.screenshot({ path: 'screenshots/14-recording-started.png' });

  await page.locator('#react-tabs-0 > img').click();
  await page.screenshot({ path: 'screenshots/15-tab-0-image-clicked.png' });

  // 8. Settings & Extension Addition Flows
  await page.getByText('Settings', { exact: true }).click();
  await page.screenshot({ path: 'screenshots/16-settings-clicked.png' });

  await page.getByRole('button', { name: 'Add Extension' }).click();
  await page.screenshot({ path: 'screenshots/17-add-extension-clicked.png' });

  await page.getByRole('button', { name: 'OmniBlocks' }).click();
  await page.screenshot({ path: 'screenshots/18-omniblocks-added.png' });

  await page.getByRole('button', { name: 'TurboWarp' }).click();
  await page.screenshot({ path: 'screenshots/19-turbowarp-added.png' });

  await page.getByRole('button', { name: 'Back' }).click();
  await page.screenshot({ path: 'screenshots/20-returned-from-extensions.png' });

  // 9. Download Trigger Execution
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('img', { name: 'Go' }).dblclick();
  
  const download = await downloadPromise;
  await page.screenshot({ path: 'screenshots/21-download-completed.png' });

  // Final confirmation
  expect(download.suggestedFilename()).not.toBeNull();
});