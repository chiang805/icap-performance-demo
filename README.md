# 企業策略、人力資源與績效整合管理系統展示板 V4.4

此專案是可部署於 GitHub Pages 的靜態展示板，使用 HTML、CSS 與 JavaScript 模組化設計。預設以 mock 資料運作，不需要 Supabase 金鑰即可開啟。

展示網址：

```text
https://chiang805.github.io/icap-performance-demo/
```

## 本版展示重點

- 整合「人力資源專案」工作日誌設計，待辦可直接帶入任務、部門工作項目、OGSM、KPI、專案、工時、進度、問題與支援需求。
- 待辦清單來源明確化：專案任務、OGSM Plans、KPI 更新週期與審核退回。
- 「員工與組織」調整為「組織圖與工作職掌定位」。
- 「任務組織」調整為「橫向組織工作職掌定位」。
- OGSM 型別支援 `O`、`G`、`S`、`M_D`、`M_P`：
  - `M_D`：Dashboard 衡量指標。
  - `M_P`：Plans 行動計畫。
- OGSM 提供樹狀檢視、網狀對應、Plans 作業與獨立檢視。
- Dashboard 調整為戰情顯示，包含燈號摘要、異常總表與異常細項。
- 職務說明書由組織工作項目繼承展開，顯示頻率、權重與產出物。

## 資料模式

- 預設：`mock`
- 未來：可複製 `config.example.js` 為 `config.js`，填入 Supabase anon key 後切換資料服務
- 禁止提交：`config.js`、密碼、service_role key、正式員工個資

## 專案結構

```text
index.html
src/
  app.js
  mock-data.js
  styles.css
  services/
docs/
supabase/
  migrations/
  seed.sql
.github/workflows/pages.yml
```

## 基本檢查

```bash
node --check src/app.js
node --check src/mock-data.js
node --check src/services/data-service.js
node --check src/services/mock-data-service.js
node --check src/services/supabase-client.js
node --check src/services/supabase-data-service.js
```

## GitHub Pages

`.github/workflows/pages.yml` 會在 `main` push 後部署整個靜態網站。
