#!/bin/bash

# RaceGo 登入測試執行腳本
# 網址: https://racego-member.webtech888.com/login
# 瀏覽器: Chromium
# 報告: 包含影片和截圖

echo "============================================"
echo "🧪 RaceGo 登入正常測試執行開始"
echo "============================================"
echo ""
echo "📋 測試配置:"
echo "  • 網址: https://racego-member.webtech888.com/login"
echo "  • 瀏覽器: Chromium"
echo "  • 類型: 正常測試 - 主流程驗證"
echo "  • 報告: 包含影片和截圖"
echo ""

# 檢查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 安裝依賴..."
    npm ci
    echo ""
fi

# 檢查 Playwright 是否已安裝
if [ ! -d "node_modules/@playwright" ]; then
    echo "🎭 安裝 Playwright..."
    npx playwright install --with-deps chromium
    echo ""
fi

# 執行測試
echo "🚀 正在執行 RaceGo 登入測試..."
echo ""

npx playwright test tests/racego-login.spec.ts --project=chromium --reporter=html,json,junit

# 檢查測試結果
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 所有測試通過！"
else
    echo ""
    echo "❌ 部分測試失敗"
fi

echo ""
echo "📊 報告位置:"
echo "  • HTML 報告: ./playwright-report/index.html"
echo "  • 測試結果: ./test-results/"
echo "  • 截圖位置: ./test-results/screenshots/"
echo "  • 影片位置: ./test-results/videos/"
echo ""
echo "📈 查看報告: npm run test:report"
echo ""
echo "============================================"
echo "✨ 測試執行完成"
echo "============================================"
