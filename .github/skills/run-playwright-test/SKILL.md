# Run Playwright Test Skill

## 目的
自動化執行 Playwright 測試套件、生成測試報告並分析測試結果，提供完整的 QA 品質保證報告。

## 需求
- Node.js 環境
- Playwright 配置檔案
- 測試用例檔案

## 執行流程

### 1. 安裝依賴
```bash
npm ci
```
- 根據 `package-lock.json` 安裝精確版本的依賴
- 確保測試環境一致性

### 2. 安裝 Playwright
```bash
npx playwright install --with-deps
```
- 安裝 Playwright 核心
- 安裝必要的系統依賴（chromium, firefox, webkit）

### 3. 執行測試
```bash
npx playwright test
```
- 執行所有測試用例
- 自動截圖失敗的測試
- 生成測試結果

### 4. 生成 HTML 報告
```bash
npx playwright show-report
```
- 開啟本地 HTML 測試報告
- 包含詳細的測試步驟、截圖和日誌

## 測試配置

### Playwright 配置要求
- **語言**：TypeScript
- **架構**：Page Object Model (POM)
- **報告格式**：HTML
- **失敗處理**：自動截圖
- **可讀性**：使用 `test.step` 組織測試步驟

### 預期輸出
- `playwright-report/` - HTML 報告目錄
- `test-results/` - 測試結果和截圖
- 失敗測試清單
- QA 品質摘要報告

## QA 品質保證指標

| 指標 | 說明 |
|------|------|
| 總測試數 | 執行的測試用例總數 |
| 成功 | 通過的測試數量 |
| 失敗 | 失敗的測試數量 |
| 跳過 | 跳過的測試數量 |
| 通過率 | (成功/總數) × 100% |
| 缺陷分類 | 功能、UI/UX、API、資料驗證等 |

## 失敗分析要點

1. **功能邏輯**
   - 業務邏輯驗證失敗
   - 邊界條件處理
   - 異常情況處理

2. **UI/UX 驗證**
   - 元素可見性
   - 交互功能
   - 頁面載入

3. **API 整合**
   - 請求/響應驗證
   - 資料一致性
   - 錯誤處理

4. **效能**
   - 載入時間
   - 響應時間
   - 資源佔用

## 輸出報告格式

### Markdown 摘要
```markdown
# 🧪 Playwright 測試執行報告

## 📊 測試概覽
- 執行時間
- 環境配置
- 測試版本

## ✅ 成功統計
- 通過測試數
- 通過率

## ❌ 失敗分析
- 失敗測試列表
- 失敗原因分類
- 建議改善事項

## 📈 詳細報告
- HTML 報告位置
- 截圖位置
- 日誌位置
```

## 持續整合

### GitHub Actions 整合
- 自動化測試執行
- 報告存檔
- 失敗通知
- 報告上傳

### 最佳實踐
- 定期執行測試
- 監控測試穩定性
- 優化失敗測試
- 維護測試覆蓋率

## 故障排除

| 問題 | 解決方案 |
|------|---------|
| 依賴安裝失敗 | 清除 node_modules，重新執行 npm ci |
| Playwright 安裝失敗 | 檢查系統依賴，運行 `npx playwright install --with-deps` |
| 測試超時 | 檢查等待時間設定，優化頁面載入策略 |
| 截圖缺失 | 確認 `screenshotOnFailure` 配置已啟用 |

## 參考資源
- [Playwright 官方文檔](https://playwright.dev/)
- [Page Object Model 最佳實踐](https://playwright.dev/docs/pom)
- [HTML 報告說明](https://playwright.dev/docs/test-reporters#html-reporter)
