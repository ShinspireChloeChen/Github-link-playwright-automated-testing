# Playwright 自動化測試框架

此倉庫包含使用 Playwright 和 Page Object Model (POM) 架構的端對端自動化測試套件。

## 📋 專案結構

```
.
├── .github/
│   ├── workflows/
│   │   └── playwright-tests.yml     # GitHub Actions 工作流程
│   └── skills/
│       └── run-playwright-test/
│           └── SKILL.md              # 測試執行技能說明
├── tests/
│   ├── pages/
│   │   ├── github-home.page.ts      # GitHub 首頁 POM
│   │   └── github-search.page.ts    # GitHub 搜尋頁面 POM
│   ├── github-home.spec.ts          # 首頁測試案例
│   └── github-search.spec.ts        # 搜尋功能測試案例
├── playwright.config.ts              # Playwright 配置
├── package.json                      # 專案依賴和腳本
└── README.md                         # 本文件
```

## 🚀 快速開始

### 環境要求
- Node.js 18+
- npm 9+

### 安裝

```bash
# 克隆倉庫
git clone <repository-url>
cd Github-link-playwright-automated-testing

# 安裝依賴
npm ci

# 安裝 Playwright 及系統依賴
npx playwright install --with-deps
```

## 📝 執行測試

### 基本命令

```bash
# 執行所有測試
npm test

# 在有頭模式執行 (可看到瀏覽器)
npm run test:headed

# 在除錯模式執行
npm run test:debug

# 執行 UI 模式 (互動式)
npm run test:ui

# 特定瀏覽器測試
npm run test:chrome
npm run test:firefox
npm run test:webkit

# 查看 HTML 報告
npm run test:report
```

## 📊 測試套件說明

### 1. GitHub 首頁測試 (`github-home.spec.ts`)

**正常場景 (✅)**
- 驗證首頁加載成功
- 驗證搜尋功能
- 驗證頁面導航

**負面場景 (❌)**
- 空搜尋查詢驗證
- 登入按鈕可用性驗證

**邊界值測試 (🔄)**
- 長搜尋查詢 (500 字元)
- 特殊字符搜尋

### 2. GitHub 搜尋功能測試 (`github-search.spec.ts`)

**正常場景 (✅)**
- 搜尋返回結果驗證
- 結果可點擊性驗證
- 結果排序功能驗證
- 結果標題存在驗證

**負面場景 (❌)**
- 搜尋不存在的倉庫
- 特定結果存在性驗證

**邊界值測試 (🔄)**
- 單個字符搜尋
- 搜尋查詢更新

## 🏗️ Page Object Model (POM) 架構

### GitHubHomePage
```typescript
- 首頁選擇器定義
- goto()          // 導航到首頁
- search()        // 執行搜尋
- isLoaded()      // 檢查頁面加載
- getPageTitle()  // 取得頁面標題
```

### GitHubSearchPage
```typescript
- 搜尋頁選擇器定義
- goto()              // 導航到搜尋結果
- isLoaded()          // 檢查結果加載
- getResultCount()    // 取得結果數量
- sortResults()       // 排序結果
- updateSearch()      // 更新搜尋查詢
```

## 📈 測試報告

### HTML 報告
- 位置: `playwright-report/index.html`
- 包含: 測試步驟、截圖、影片、日誌
- 命令: `npm run test:report`

### 測試數據
- JSON 格式: `test-results/results.json`
- JUnit 格式: `test-results/junit.xml`
- 用於 CI/CD 整合

### 失敗工件
- 位置: `test-results/`
- 包含: 失敗截圖、影片、追蹤

## 🔄 CI/CD 整合

### GitHub Actions

工作流程配置在 `.github/workflows/playwright-tests.yml`

**功能:**
- ✅ 多瀏覽器並行測試 (Chromium, Firefox, WebKit)
- 📊 自動報告生成
- 📤 工件上傳
- 💬 PR 評論
- 📄 GitHub Pages 發佈

**觸發條件:**
- Push 到 `main` 和 `feature/**` 分支
- Pull Request 到 `main`
- 手動工作流程執行 (`workflow_dispatch`)
- 日程排程 (每日 UTC 2:00)

## 🔧 配置

### playwright.config.ts 設置

```typescript
// 超時設定
timeout: 30000              // 測試超時
expect.timeout: 5000        // 斷言超時

// 報告
reporters: [
  'html',                   // HTML 報告
  'json',                   // JSON 數據
  'junit',                  // JUnit XML
  'list'                    // 終端輸出
]

// 失敗處理
screenshot: 'only-on-failure'
video: 'retain-on-failure'
trace: 'on-first-retry'

// 並行執行
fullyParallel: true
workers: undefined          // 自動決定工作進程數
```

## 📊 QA 品質指標

| 指標 | 說明 |
|------|------|
| 通過率 | (成功/總數) × 100% |
| 失敗數 | 未通過的測試數 |
| 覆蓋範圍 | 功能/頁面覆蓋率 |
| 穩定性 | 測試失敗的一致性 |
| 執行時間 | 完整測試套件執行時間 |

## 🐛 常見問題

### 問題: 依賴安裝失敗
**解決方案:**
```bash
rm -rf node_modules package-lock.json
npm ci
```

### 問題: Playwright 安裝失敗
**解決方案:**
```bash
npx playwright install --with-deps
```

### 問題: 測試超時
**解決方案:**
- 增加 `timeout` 在 `playwright.config.ts`
- 檢查網絡連接
- 檢查目標網站可用性

### 問題: 選擇器失效
**解決方案:**
- 更新頁面物件中的選擇器
- 使用 Playwright Inspector: `npx playwright codegen <url>`
- 確認 UI 變更

## 🛠️ 開發工具

### Playwright Inspector
```bash
npx playwright test --debug
```

### 代碼生成器
```bash
npx playwright codegen https://github.com
```

### 追蹤檢視器
```bash
npx playwright show-trace trace.zip
```

## 📚 最佳實踐

1. **POM 架構**
   - 分離頁面邏輯與測試邏輯
   - 可複用的頁面方法
   - 易於維護和更新

2. **測試組織**
   - 使用 `test.describe()` 分組
   - 使用 `test.step()` 提高可讀性
   - 清晰的測試命名

3. **測試類型**
   - 正常場景: 主流程驗證
   - 負面場景: 邊界和錯誤處理
   - 邊界值: 極限情況測試

4. **等待策略**
   - 使用自動等待
   - 避免硬睡眠 (`sleep`)
   - 使用 `waitForLoadState()`

5. **資源管理**
   - 自動瀏覽器清理
   - 截圖和影片管理
   - 日誌追蹤

## 📖 相關資源

- [Playwright 官方文檔](https://playwright.dev/)
- [Page Object Model 指南](https://playwright.dev/docs/pom)
- [HTML 報告說明](https://playwright.dev/docs/test-reporters#html-reporter)
- [CI/CD 整合](https://playwright.dev/docs/ci)

## 📝 貢獻

歡迎提交 Issue 和 Pull Request！

## 👤 作者

ShinspireChloeChen - Senior QA Engineer

## 📄 許可證

MIT

---

**更新時間**: 2026-06-02
**Playwright 版本**: 1.40.0+
**Node.js 版本**: 18+
