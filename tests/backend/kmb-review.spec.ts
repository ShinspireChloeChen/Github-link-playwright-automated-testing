import { test, expect } from '../../src/fixtures/auth.fixture';
import { KmbReviewPage }   from '../../src/pages/backend/KmbReviewPage';
import { KmbCategoryPage } from '../../src/pages/backend/KmbCategoryPage';
import { loginBackend, URLS } from '../../src/fixtures/auth.fixture';

const TS = Date.now();

test.describe('KMB 知識庫類別管理', () => {

  test('KMB-01 後台可進入類別管理頁', async ({ backendPage: page }) => {
    const category = new KmbCategoryPage(page);
    await test.step('前往類別管理頁', async () => { await category.goto(); });
    await test.step('確認頁面標題可見', async () => { await expect(category.heading).toBeVisible(); });
  });

  test('KMB-02 新增一級類別成功', async ({ backendPage: page }) => {
    const category = new KmbCategoryPage(page);
    const catName = `一級類別_${TS}`;
    await test.step('前往類別管理頁', async () => { await category.goto(); });
    await test.step('新增類別', async () => { await category.addCategory(catName); });
    await test.step('確認類別出現在列表', async () => {
      await expect(page.getByText(/新增成功|Created/i)).toBeVisible();
      await expect(page.getByText(catName)).toBeVisible();
    });
  });

  test('KMB-04 [負向] 類別名稱為空不允許新增', async ({ backendPage: page }) => {
    const category = new KmbCategoryPage(page);
    await test.step('前往類別管理頁並開啟新增表單', async () => { await category.goto(); await category.addCategoryBtn.click(); });
    await test.step('不填名稱直接儲存', async () => { await category.saveBtn.click(); });
    await test.step('確認錯誤訊息', async () => { await expect(category.nameError).toBeVisible(); });
  });

  test('KMB-10 [負向][權限] 無管理員權限帳號無法進入類別管理', async ({ page }) => {
    await test.step('以 reviewer 身份登入後台', async () => { await loginBackend(page, 'reviewer'); });
    await test.step('嘗試進入類別管理頁', async () => { await page.goto(URLS.backend + '/km/category'); });
    await test.step('確認被攔截', async () => { await expect(page.getByText(/無權限|Access Denied|403/i)).toBeVisible(); });
  });

});

test.describe('KMB 知識庫審核 — 基本操作', () => {

  test('KMB-21 後台可進入審核列表', async ({ backendPage: page }) => {
    const review = new KmbReviewPage(page);
    await test.step('前往審核列表', async () => { await review.goto(); });
    await test.step('確認頁面', async () => { await expect(review.heading).toBeVisible(); await expect(review.reviewTable).toBeVisible(); });
  });

  test('KMB-28 全選勾選框選取所有列', async ({ backendPage: page }) => {
    const review = new KmbReviewPage(page);
    await test.step('前往審核列表', async () => { await review.goto(); });
    await test.step('點擊全選', async () => { await review.selectAllRows(); });
    await test.step('確認所有列被勾選', async () => {
      const boxes = review.tableRows.locator('input[type="checkbox"]');
      const count = await boxes.count();
      for (let i = 0; i < count; i++) await expect(boxes.nth(i)).toBeChecked();
    });
  });

  test('KMB-34 依狀態篩選只顯示待審', async ({ backendPage: page }) => {
    const review = new KmbReviewPage(page);
    await test.step('篩選待審狀態', async () => { await review.goto(); await review.filterByStatus('待審'); });
    await test.step('確認所有列都是待審', async () => {
      const statuses = await page.locator('[data-testid="status-cell"]').allTextContents();
      for (const s of statuses) expect(s).toMatch(/待審|Pending/i);
    });
  });

  test('KMB-38 點擊欄位標題可排序', async ({ backendPage: page }) => {
    const review = new KmbReviewPage(page);
    await test.step('前往審核列表', async () => { await review.goto(); });
    await test.step('點擊送審日標頭', async () => { const th = page.locator('th').filter({ hasText: /送審日/i }); await th.click(); await page.waitForLoadState('networkidle'); });
    await test.step('確認 aria-sort 屬性', async () => { const th = page.locator('th').filter({ hasText: /送審日/i }); await expect(th).toHaveAttribute('aria-sort', /(ascending|descending)/i); });
  });

});
