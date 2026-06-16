# Supabase 設定

## 建立資料庫

1. 在 Supabase 建立新專案。
2. 執行 `supabase/migrations/202606160001_initial_schema.sql`。
3. 執行 `supabase/seed.sql` 建立展示資料。

## 前端設定

複製 `config.example.js` 為 `config.js`：

```js
export const CONFIG = {
  dataMode: "supabase",
  supabaseUrl: "https://your-project.supabase.co",
  supabaseAnonKey: "your-anon-key"
};
```

並在 `index.html` 的 `src/app.js` 前載入該檔案。正式公開展示若不需要連線 Supabase，請維持 mock 模式且不要提交 `config.js`。

只可使用 anon key。不要將 `service_role` key、密碼或正式員工個資提交到 repository。

## RLS

初版 migration 已啟用主要資料表 RLS，並用 `auth.uid()` 對應 `user_account.auth_user_id`。正式導入時需依公司資料範圍規則補強各表政策。
