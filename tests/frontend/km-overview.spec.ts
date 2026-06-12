import { test, expect } from '../../src/fixtures/auth.fixture';
import { KmOverviewPage } from '../../src/pages/frontend/KmOverviewPage';
import { loginFrontend, URLS } from '../../src/fixtures/auth.fixture';

test.describe('KM 知識總覽', () => {

  test('KM-01 登入後可進入知識庫總覽頁', async ({ frontendPage: page }) => {
    const overview = new KmOverviewPage(page);
    await test.step('前往知識庫總覽', async () => { await overview.goto(); });
    await test.step('確認標題與文章卡片可見', async () => {
      await expect(page.getByRole('heading', { name: /知識庫|Knowledge/i })).toBeVisible();
      await expect(overview.articleCards.first()).toBeVisible();
    });
  });

  test('KM-02 文章卡片顯示標題、類別、發布日', async ({ frontendPage: page }) => {
    const overview = new KmOverviewPage(page);
    await test.step('前往知識庫總覽', async () => { await overview.goto(); });
    await test.step('確認卡片必要欄位存在', async () => {
      const card = overview.articleCards.first();
      await expect(card.getByRole('heading')).toBeVisible();
      await expect(card.locator('[data-testid="category"]')).toBeVisible();
      await expect(card.locator('[data-testid="publish-date"]')).toBeVisible();
    });
  });

  test('KM-03 總覽頁可切換分類 Tab', async ({ frontendPage: page }) => {
    const overview = new KmOverviewPage(page);
    await test.step('前往知識庫總覽', async () => { await overview.goto(); });
    await test.step('點擊第二個 Tab', async () => { await overview.selectCategoryTab(1); });
    await test.step('確認 Tab 為選取狀態', async () => { await expect(overview.categoryTabs.nth(1)).toHaveAttribute('aria-selected', 'true'); });
  });

  test('KM-08 [負向] 搜尋不存在關鍵字顯示空狀態', async ({ frontendPage: page }) => {
    const overview = new KmOverviewPage(page);
    await test.step('前往知識庫總覽', async () => { await overview.goto(); });
    await test.step('搜尋不存在字串', async () => { await overview.search('zzz不存在的內容xyz12345'); });
    await test.step('確認顯示查無結果', async () => { await expect(page.getByText(/查無|No Result|找不到/i)).toBeVisible(); });
  });

  test('KM-10 [負向][安全] XSS 搜尋不執行腳本', async ({ frontendPage: page }) => {
    const overview = new KmOverviewPage(page);
    let alertFired = false;
    await test.step('前往知識庫總覽', async () => { await overview.goto(); page.once('dialog', () => { alertFired = true; }); });
    await test.step('輸入 XSS payload', async () => { await overview.search('<script>alert("xss")</script>'); await page.waitForTimeout(1_000); });
    await test.step('確認未觸發 alert', async () => { expect(alertFired).toBe(false); });
  });

  test('KM-11 選擇類別後只顯示對應文章', async ({ frontendPage: page }) => {
    const overview = new KmOverviewPage(page);
    await test.step('前往知識庫總覽', async () => { await overview.goto(); });
    await test.step('篩選 IT 類別', async () => { await overview.filterByCategory('IT'); });
    await test.step('確認每張卡片類別都是 IT', async () => {
      const count = await overview.articleCards.count();
      for (let i = 0; i < Math.min(count, 5); i++) {
        const cat = await overview.articleCards.nth(i).locator('[data-testid="category"]').textContent();
        expect(cat).toContain('IT');
      }
    });
  });

  test('KM-13 重設篩選後回到全類別', async ({ frontendPage: page }) => {
    const overview = new KmOverviewPage(page);
    await test.step('前往並篩選類別', async () => { await overview.goto(); await overview.filterByCategory('IT'); });
    await test.step('重設篩選', async () => { await overview.resetFilter(); });
    await test.step('確認文章列表恢復', async () => { await expect(overview.articleCards.first()).toBeVisible(); });
  });

  test('KM-15 [負向][權限] 無 KM 權限帳號被攔截', async ({ page }) => {
    await test.step('使用無 KM 權限帳號登入', async () => { await loginFrontend(page, 'noKmRole'); });
    await test.step('直接進入 /km 路由', async () => { await page.goto(URLS.frontend + '/km'); });
    await test.step('確認顯示無權限', async () => { await expect(page.getByText(/無權限|Access Denied|403/i)).toBeVisible(); });
  });

});
