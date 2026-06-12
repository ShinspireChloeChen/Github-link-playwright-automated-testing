import { test, expect } from '../../src/fixtures/auth.fixture';
import { KmOverviewPage }      from '../../src/pages/frontend/KmOverviewPage';
import { KmArticleFormPage }   from '../../src/pages/frontend/KmArticleFormPage';
import { KmArticleDetailPage } from '../../src/pages/frontend/KmArticleDetailPage';

const TS = Date.now();
const BASE_ARTICLE = { title: `自動化文章_${TS}`, category: 'IT', content: '自動化測試內容。' };

test.describe('KM 文章詳情', () => {

  test('KM-16 點擊文章卡片可進入詳情頁', async ({ frontendPage: page }) => {
    const overview = new KmOverviewPage(page);
    const detail = new KmArticleDetailPage(page);
    await test.step('前往知識庫總覽', async () => { await overview.goto(); });
    await test.step('點擊第一篇文章卡片', async () => { await overview.clickFirstArticle(); });
    await test.step('確認進入詳情頁', async () => {
      await expect(page).toHaveURL(/\/km\/\d+/i);
      await expect(detail.title).toBeVisible();
    });
  });

  test('KM-17 詳情頁顯示標題、內容、類別、作者', async ({ frontendPage: page }) => {
    const overview = new KmOverviewPage(page);
    const detail = new KmArticleDetailPage(page);
    await test.step('進入第一篇文章', async () => { await overview.goto(); await overview.clickFirstArticle(); });
    await test.step('確認必要欄位', async () => {
      await expect(detail.title).toBeVisible();
      await expect(detail.content).toBeVisible();
      await expect(detail.category).toBeVisible();
      await expect(detail.author).toBeVisible();
    });
  });

  test('KM-20 [負向] 不存在文章 ID 顯示 404', async ({ frontendPage: page }) => {
    await test.step('導向不存在 ID', async () => { await page.goto('/km/999999999'); });
    await test.step('確認 404', async () => { await expect(page.getByText(/404|找不到|Not Found/i)).toBeVisible(); });
  });

});

test.describe('KM 新增文章', () => {

  test('KM-22 填寫完整資料送審後進入待審狀態', async ({ frontendPage: page }) => {
    const form = new KmArticleFormPage(page);
    await test.step('進入新增頁', async () => { await form.goto(); });
    await test.step('填寫表單', async () => { await form.fillForm(BASE_ARTICLE); });
    await test.step('送審', async () => { await form.submitForReview(); });
    await test.step('確認狀態為待審', async () => {
      await expect(page.getByText(/送審成功|Submitted/i)).toBeVisible();
      await expect(form.articleStatus).toHaveText(/待審|Pending/i);
    });
  });

  test('KM-24 [負向] 標題為空不允許送出', async ({ frontendPage: page }) => {
    const form = new KmArticleFormPage(page);
    await test.step('進入新增頁並清空標題', async () => { await form.goto(); await form.fillForm({ ...BASE_ARTICLE, title: '' }); });
    await test.step('送出並確認錯誤', async () => { await form.submitForReview(); await expect(form.titleError).toBeVisible(); });
  });

  test('KM-26 [負向][邊界] 標題超過 100 字顯示錯誤', async ({ frontendPage: page }) => {
    const form = new KmArticleFormPage(page);
    await test.step('進入新增頁', async () => { await form.goto(); });
    await test.step('填入 101 字標題', async () => { await form.titleInput.fill('A'.repeat(101)); });
    await test.step('確認錯誤訊息', async () => { await form.submitForReview(); await expect(page.getByText(/超過字數|Too long|最多/i)).toBeVisible(); });
  });

  test('KM-29 [負向] 效期設為過去日期顯示錯誤', async ({ frontendPage: page }) => {
    const form = new KmArticleFormPage(page);
    await test.step('填寫含過去效期的表單', async () => { await form.goto(); await form.fillForm({ ...BASE_ARTICLE, expireDate: '2020-01-01' }); });
    await test.step('確認效期錯誤', async () => { await form.submitForReview(); await expect(page.getByText(/效期不能早於今日|Invalid date/i)).toBeVisible(); });
  });

});

test.describe('KM 進階功能', () => {

  test('KM-49 可收藏文章，圖示改變', async ({ frontendPage: page }) => {
    const overview = new KmOverviewPage(page);
    const detail = new KmArticleDetailPage(page);
    await test.step('進入文章', async () => { await overview.goto(); await overview.clickFirstArticle(); });
    await test.step('收藏', async () => { await detail.toggleFavorite(); });
    await test.step('確認已收藏', async () => { expect(await detail.isFavorited()).toBe(true); });
  });

});
