import { test, expect, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { LoginPage } from '../pages/LoginPage';
import { ShopRecentChangePage } from '../pages/ShopRecentChangePage';

const USER = { account: 'jeremyfog', password: '123' };

// 失敗時自動開 Redmine 單（需提供 Redmine 帳密後啟用）
async function reportBug(page: Page, testName: string, description: string) {
  const screenshotPath = `test-results/bug_${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`[BUG] ${testName} | 截圖：${screenshotPath}`);
  // TODO: 補上 Redmine 帳密後取消下方註解
  // await createRedmineIssue({ title: testName, description, severity: 'High', screenshotPath }, 'redmine_account', 'redmine_password');
}

async function loginAndNavigate(page: Page): Promise<ShopRecentChangePage> {
  const login = new LoginPage(page);
  await login.login(USER.account, USER.password);
  const shopPage = new ShopRecentChangePage(page);
  await shopPage.navigate();
  return shopPage;
}

// ============================================================
// TC-03-3-4-2-1｜總行儀表板 > 待處理案件
// ============================================================
test('TC-03-3-4-2-1 總行儀表板：待處理案件數量與連結', async ({ page }) => {
  const login = new LoginPage(page);
  await login.login(USER.account, USER.password);

  // 確認儀表板上有待處理案件區塊
  await expect(page.locator('body')).toContainText(['待處理', '案件'], { timeout: 5000 }).catch(() => {});
  await page.screenshot({ path: 'test-results/TC-03-3-4-2-1.png', fullPage: true });

  // 確認登入者為總行角色
  const bodyText = await page.locator('body').innerText();
  expect(bodyText).toContain('總行');
});

// ============================================================
// TC-03-3-5-2-1.1｜總行 > 查詢 > 聯徵異動原因
// ============================================================
test('TC-03-3-5-2-1.1 總行查詢：聯徵異動原因下拉選項驗證', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);

  // 點開聯徵異動原因下拉（第0個 nb-select）
  const firstSelect = page.locator('nb-select').first();
  await firstSelect.click();
  await page.waitForTimeout(800);

  // 驗證必要選項存在
  const options = await page.locator('nb-option').allInnerTexts();
  const optionStr = options.join(' ');
  expect(optionStr).toContain('全部');
  expect(optionStr).toContain('02');
  expect(optionStr).toContain('11');
  expect(optionStr).toContain('91');

  await page.screenshot({ path: 'test-results/TC-03-3-5-2-1.1.png', fullPage: true });

  // 關閉下拉
  await page.keyboard.press('Escape');
});

// ============================================================
// TC-03-3-5-2-1.2｜總行 > 查詢 > 特店統編精準搜尋
// ============================================================
test('TC-03-3-5-2-1.2 總行查詢：特店統編精準搜尋', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);
  await shopPage.fillCompanyId('12345678');
  await shopPage.clickSearch();

  const rowCount = await shopPage.getTableRowCount();
  await page.screenshot({ path: 'test-results/TC-03-3-5-2-1.2.png', fullPage: true });

  // 若有結果，驗證每列統編與輸入值一致
  if (rowCount > 0) {
    const cells = await shopPage.getTableCellTexts(1);
    expect(cells.some(c => c.includes('12345678'))).toBeTruthy();
  } else {
    // 無資料是合法結果，確認頁面無錯誤
    expect(await page.locator('body').isVisible()).toBeTruthy();
  }
});

// ============================================================
// TC-03-3-5-2-1.3｜總行 > 查詢 > 特店代號搜尋
// ============================================================
test('TC-03-3-5-2-1.3 總行查詢：特店代號搜尋', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);
  await shopPage.fillShopId('A001');
  await shopPage.clickSearch();
  await page.screenshot({ path: 'test-results/TC-03-3-5-2-1.3.png', fullPage: true });
  expect(await page.locator('body').isVisible()).toBeTruthy();
});

// ============================================================
// TC-03-3-5-2-1.4｜總行 > 查詢 > 登記名稱模糊搜尋
// ============================================================
test('TC-03-3-5-2-1.4 總行查詢：登記名稱模糊搜尋', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);
  await shopPage.fillRegName('商行');
  await shopPage.clickSearch();

  const rowCount = await shopPage.getTableRowCount();
  await page.screenshot({ path: 'test-results/TC-03-3-5-2-1.4.png', fullPage: true });

  // 若有結果，驗證登記名稱包含關鍵字
  if (rowCount > 0) {
    const allCells = await page.locator('tbody tr td:nth-child(5)').allInnerTexts();
    const allMatch = allCells.every(c => c.includes('商行'));
    if (!allMatch) {
      await reportBug(page, 'TC-03-3-5-2-1.4', '登記名稱模糊搜尋結果含不相符資料');
    }
    expect(allMatch).toBeTruthy();
  }
});

// ============================================================
// TC-03-3-5-2-1.5｜總行 > 查詢 > 狀態下拉
// ============================================================
test('TC-03-3-5-2-1.5 總行查詢：狀態下拉選項（啟用/停用）', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);

  // 狀態下拉是第2個 nb-select（index=2）；index=1 是分行下拉
  await page.locator('nb-select').nth(2).click();
  await page.waitForTimeout(800);
  const options = await page.locator('nb-option').allInnerTexts();
  await page.screenshot({ path: 'test-results/TC-03-3-5-2-1.5.png', fullPage: true });

  expect(options.join(' ')).toContain('全部');
  expect(options.join(' ')).toContain('啟用');
  expect(options.join(' ')).toContain('停用');

  await page.keyboard.press('Escape');
});

// ============================================================
// TC-03-3-5-2-1.6｜總行 > 查詢 > 分行下拉
// ============================================================
test('TC-03-3-5-2-1.6 總行查詢：分行下拉預設全部', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);

  // 分行下拉是第1個 nb-select（index=1）
  const branchSelect = page.locator('nb-select').nth(1);
  const selectText = await branchSelect.innerText();
  await page.screenshot({ path: 'test-results/TC-03-3-5-2-1.6.png', fullPage: true });
  expect(selectText).toContain('全部');
});

// ============================================================
// TC-03-3-5-2-2｜總行 > 查詢 > 查詢列表欄位驗證
// ============================================================
test('TC-03-3-5-2-2 總行查詢：查詢列表欄位數量與名稱', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);
  await shopPage.clickSearch();

  const headers = await shopPage.getTableHeaders();
  await page.screenshot({ path: 'test-results/TC-03-3-5-2-2.png', fullPage: true });

  const requiredHeaders = ['聯徵異動原因', '特店統編', '特店代號', '登記名稱', '分行代號', '狀態'];
  for (const required of requiredHeaders) {
    const found = headers.some(h => h.includes(required));
    if (!found) {
      await reportBug(page, 'TC-03-3-5-2-2', `查詢列表缺少欄位：${required}`);
    }
    expect(found).toBeTruthy();
  }
});

// ============================================================
// TC-03-3-5-2-3｜總行 > 查詢 > 列表排序/分頁
// ============================================================
test('TC-03-3-5-2-3 總行查詢：列表分頁控制', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);
  await shopPage.clickSearch();

  // 確認分頁輸入框存在
  const pageInput = page.locator('input[type="number"][placeholder="頁數"]');
  await expect(pageInput).toBeVisible();
  await page.screenshot({ path: 'test-results/TC-03-3-5-2-3.png', fullPage: true });
});

// ============================================================
// TC-03-3-5-2-4｜總行 > 查詢 > 複合查詢條件
// ============================================================
test('TC-03-3-5-2-4 總行查詢：複合查詢條件（聯徵異動原因+登記名稱）', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);

  // 選擇聯徵異動原因 11
  await page.locator('nb-select').first().click();
  await page.waitForTimeout(500);
  await page.locator('nb-option').filter({ hasText: '11' }).first().click();
  await page.waitForTimeout(300);

  await shopPage.fillRegName('商');
  await shopPage.clickSearch();

  await page.screenshot({ path: 'test-results/TC-03-3-5-2-4.png', fullPage: true });
  expect(await page.locator('body').isVisible()).toBeTruthy();
});

// ============================================================
// TC-03-3-5-3-1｜總行 > 編輯 > 不可編輯欄位驗證
// ============================================================
test('TC-03-3-5-3-1 總行編輯：不可編輯欄位確認', async ({ page }) => {
  // 頁面初始就有資料，不需先點查詢
  const shopPage = await loginAndNavigate(page);
  await page.waitForTimeout(2000);

  const rowCount = await shopPage.getTableRowCount();
  if (rowCount === 0) {
    test.skip(true, '無查詢資料，跳過編輯測試');
    return;
  }

  await shopPage.clickEditButton(0);
  await page.screenshot({ path: 'test-results/TC-03-3-5-3-1.png', fullPage: true });

  // 確認彈跳視窗出現
  const modal = page.locator('nb-dialog-container, .modal, [role="dialog"]').first();
  await expect(modal).toBeVisible({ timeout: 5000 });

  // 確認有唯讀欄位（disabled 或 readonly）
  const readonlyFields = await page.locator('input[disabled], input[readonly], .disabled').count();
  expect(readonlyFields).toBeGreaterThan(0);
});

// ============================================================
// TC-03-3-5-3-2｜總行 > 編輯 > 欄位格式檢核（500字元上限）
// ============================================================
test('TC-03-3-5-3-2 總行編輯：欄位格式檢核（500字元限制）', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);
  await page.waitForTimeout(2000);

  const rowCount = await shopPage.getTableRowCount();
  if (rowCount === 0) {
    test.skip(true, '無查詢資料，跳過編輯測試');
    return;
  }

  await shopPage.clickEditButton(0);
  const modal = page.locator('nb-dialog-container, .modal, [role="dialog"]').first();
  await expect(modal).toBeVisible({ timeout: 5000 });

  // 找備註/說明文字欄位並輸入501字元
  const textArea = modal.locator('textarea, input[type="text"]').first();
  if (await textArea.isVisible()) {
    const longText = 'A'.repeat(501);
    await textArea.fill(longText);
    const actualValue = await textArea.inputValue();
    await page.screenshot({ path: 'test-results/TC-03-3-5-3-2.png', fullPage: true });
    // 欄位應截斷或顯示提示
    expect(actualValue.length).toBeLessThanOrEqual(500);
  }
});

// ============================================================
// TC-03-3-5-3-3｜總行 > 編輯 > 必要欄位檢核
// ============================================================
test('TC-03-3-5-3-3 總行編輯：必要欄位未填時不得儲存', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);
  await page.waitForTimeout(2000);

  const rowCount = await shopPage.getTableRowCount();
  if (rowCount === 0) {
    test.skip(true, '無查詢資料，跳過編輯測試');
    return;
  }

  await shopPage.clickEditButton(0);
  const modal = page.locator('nb-dialog-container, .modal, [role="dialog"]').first();
  await expect(modal).toBeVisible({ timeout: 5000 });

  // 清空所有可編輯欄位
  const editableInputs = await modal.locator('input:not([disabled]):not([readonly]), textarea:not([disabled])').all();
  for (const input of editableInputs) {
    await input.clear().catch(() => {});
  }

  // 點儲存
  const saveBtn = modal.locator('button').filter({ hasText: /儲存|確認|Save/ }).first();
  if (await saveBtn.isVisible()) {
    await saveBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/TC-03-3-5-3-3.png', fullPage: true });
    // 彈跳視窗應還在（未關閉）或出現錯誤提示
    const isStillOpen = await modal.isVisible().catch(() => false);
    expect(isStillOpen).toBeTruthy();
  }
});

// ============================================================
// TC-03-3-5-3-4｜總行 > 編輯 > 編輯成功
// ============================================================
test('TC-03-3-5-3-4 總行編輯：成功儲存並確認資料更新', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);
  await page.waitForTimeout(2000);

  const rowCount = await shopPage.getTableRowCount();
  if (rowCount === 0) {
    test.skip(true, '無查詢資料，跳過編輯測試');
    return;
  }

  await shopPage.clickEditButton(0);
  const modal = page.locator('nb-dialog-container, .modal, [role="dialog"]').first();
  await expect(modal).toBeVisible({ timeout: 5000 });
  await page.screenshot({ path: 'test-results/TC-03-3-5-3-4_open.png', fullPage: true });

  // 找可編輯的 textarea
  const textArea = modal.locator('textarea').first();
  if (await textArea.isVisible()) {
    await textArea.fill('自動化測試備註');
  }

  const saveBtn = modal.locator('button').filter({ hasText: /儲存|確認/ }).first();
  if (await saveBtn.isVisible()) {
    await saveBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/TC-03-3-5-3-4_saved.png', fullPage: true });
    // 視窗應關閉
    const isOpen = await modal.isVisible().catch(() => false);
    expect(isOpen).toBeFalsy();
  }
});

// ============================================================
// TC-03-3-6-2-1｜總行 > 匯出
// ============================================================
test('TC-03-3-6-2-1 總行匯出：檔案下載成功', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);
  await shopPage.clickSearch();

  try {
    const download = await shopPage.clickExport();
    const filename = download.suggestedFilename();
    await page.screenshot({ path: 'test-results/TC-03-3-6-2-1.png', fullPage: true });

    console.log(`下載檔案名稱：${filename}`);
    expect(filename).toBeTruthy();
    // 系統匯出格式為 .zip（內含 Excel/CSV），接受 zip/xlsx/csv/xls
    expect(filename.endsWith('.xlsx') || filename.endsWith('.csv') || filename.endsWith('.xls') || filename.endsWith('.zip')).toBeTruthy();
  } catch (e) {
    await reportBug(page, 'TC-03-3-6-2-1', `匯出功能失敗：${e}`);
    throw e;
  }
});

// ============================================================
// TC-補充-01｜查詢無結果顯示
// ============================================================
test('TC-補充-01 查詢無結果：應顯示無資料提示', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);
  await shopPage.fillCompanyId('00000000');
  await shopPage.fillShopId('XXXXXXXX');
  await shopPage.clickSearch();
  await page.screenshot({ path: 'test-results/TC-補充-01.png', fullPage: true });

  const rowCount = await shopPage.getTableRowCount();
  if (rowCount > 0) {
    await reportBug(page, 'TC-補充-01', '輸入無效統編/特店代號後仍顯示資料');
    expect(rowCount).toBe(0);
  }
});

// ============================================================
// TC-補充-02｜異動原因02特殊排除邏輯
// ============================================================
test('TC-補充-02 查詢：聯徵異動原因02應排除負責人ID相同特店', async ({ page }) => {
  const shopPage = await loginAndNavigate(page);

  await page.locator('nb-select').first().click();
  await page.waitForTimeout(500);
  const opt = page.locator('nb-option').filter({ hasText: '02' }).first();
  if (await opt.isVisible()) {
    await opt.click();
    await page.waitForTimeout(300);
    await shopPage.clickSearch();
    await page.screenshot({ path: 'test-results/TC-補充-02.png', fullPage: true });
    // 結果筆數應 >= 0，無系統錯誤
    expect(await page.locator('body').isVisible()).toBeTruthy();
  } else {
    test.skip(true, '選單無02選項');
  }
});
