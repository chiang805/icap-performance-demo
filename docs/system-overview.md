# 系統總覽

本系統展示企業策略、人力資源與績效管理的整合資料模型與工作流程。第一版以 GitHub Pages 靜態網站展示，資料來源預設為 mock。

## 核心設計

- 功能權限與資料範圍權限分離。
- 員工主檔與登入帳號分離。
- 職務、職稱、職等分離。
- OGSM 採 O、G、S、M 節點式模型。
- Measure 與 KPI 分離，一個 Measure 可連結多個 KPI。
- 工作日誌不得直接修改正式 KPI 數值，須經確認流程。
- 正式資料以 `status` 停用、作廢、版本保存，不直接永久刪除。
- 所有審核與關鍵異動寫入 audit log。

## 資料服務抽象

前端透過 `DataService` 取得資料：

- `MockDataService`：展示用資料，預設啟用。
- `SupabaseDataService`：未來接 Supabase。
- 未來可新增 SQL Server API adapter，保留同一組方法介面。

## 部署

GitHub Actions 會在 `main` push 後部署整個靜態網站到 GitHub Pages。
