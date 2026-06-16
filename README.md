# 企業策略、人力資源與績效整合管理系統展示板 V4.4

此專案是可部署於 GitHub Pages 的靜態展示板，使用 HTML、CSS 與 JavaScript 模組化設計。預設以 mock 資料運作，不需要 Supabase 金鑰即可開啟。

## 快速開始

直接開啟 `index.html`，或部署到 GitHub Pages：

```text
https://chiang805.github.io/icap-performance-demo/
```

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
