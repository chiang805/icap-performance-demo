export const mockData = {
  currentUser: {
    id: "demo-user-001",
    name: "展示使用者",
    account: "demo@example.com",
    roles: ["Admin", "HR", "Manager", "Executive Viewer"],
    functionPermissions: ["dashboard:view", "ogsm:review", "worklog:confirm", "audit:view"],
    dataScopes: ["company", "department:strategy", "task_org:transformation"]
  },
  homeSummary: {
    todayTodos: [
      { title: "確認營運效率 KPI 實績", owner: "策略辦公室", due: "今日", status: "pending" },
      { title: "補交跨部門協作日誌", owner: "流程改善小組", due: "今日", status: "warning" }
    ],
    overdue: [
      { title: "客服週期時間 M 節點更新", days: 2, light: "red" }
    ],
    upcoming: [
      { title: "Q3 OGSM 版本送審", due: "3 天後", light: "yellow" },
      { title: "人才梯隊盤點", due: "5 天後", light: "green" }
    ],
    ogsmNeedsUpdate: 4,
    kpiNeedsInput: 6,
    workLogCompleted: false,
    approvals: 5,
    collaborations: 7,
    checklist: [
      { label: "檢查今日待辦", done: true },
      { label: "填寫工作日誌", done: false },
      { label: "確認 KPI 風險", done: false },
      { label: "回覆待審核事項", done: true }
    ]
  },
  organizations: {
    departments: [
      { id: "corp", name: "總經理室", parentId: null, mission: "公司策略節奏與治理" },
      { id: "strategy", name: "策略發展部", parentId: "corp", mission: "OGSM 展開與績效追蹤" },
      { id: "hr", name: "人力資源部", parentId: "corp", mission: "組織能力與人才系統" },
      { id: "ops", name: "營運管理部", parentId: "corp", mission: "流程改善與交付品質" }
    ],
    employees: [
      { code: "E-DEMO-001", displayName: "範例主管 A", department: "策略發展部", position: "策略經理", grade: "M2", manager: "範例主管 B", reviewer: "指定審核人 C" },
      { code: "E-DEMO-002", displayName: "範例專員 B", department: "人力資源部", position: "HRBP", grade: "P3", manager: "範例主管 A", reviewer: "指定審核人 C" }
    ],
    workItems: [
      "策略議題盤點",
      "績效制度維護",
      "人才盤點",
      "流程改善專案管理"
    ]
  },
  taskOrganizations: [
    { type: "專案小組", name: "V4.4 整合展示專案", lead: "範例主管 A", members: 8, allocation: "20%-60%", ogsm: "S1 數位治理" },
    { type: "改善小組", name: "KPI 資料品質改善", lead: "範例專員 B", members: 5, allocation: "10%-30%", ogsm: "M2 KPI 準確率" },
    { type: "委員會", name: "績效校準委員會", lead: "範例主管 C", members: 10, allocation: "5%-15%", ogsm: "G1 組織目標達成" }
  ],
  ogsm: {
    nodes: [
      { id: "O1", type: "O", title: "建立策略、人資與績效一致的管理節奏", owner: "總經理室", status: "published", light: "green" },
      { id: "G1", type: "G", title: "年度策略目標達成率 90%", owner: "策略發展部", parentId: "O1", status: "review", light: "yellow" },
      { id: "S1", type: "S", title: "建立跨部門目標治理機制", owner: "人力資源部", parentId: "G1", status: "published", light: "green" },
      { id: "M1", type: "M", title: "每月 OGSM 更新準時率", owner: "策略發展部", parentId: "S1", status: "published", light: "red" },
      { id: "M2", type: "M", title: "KPI 資料完整率", owner: "營運管理部", parentId: "S1", status: "draft", light: "blue" }
    ],
    relations: [
      { from: "S1", to: "M2", type: "支援" },
      { from: "M1", to: "M2", type: "依賴" },
      { from: "G1", to: "M1", type: "共背" }
    ],
    versions: [
      { version: "4.4.0-demo", status: "發布", approvedBy: "範例審核人", note: "展示用版本" }
    ]
  },
  kpis: [
    { name: "OGSM 更新準時率", measure: "每月完成更新的節點比例", target: 95, actual: 82, unit: "%", direction: "越高越好", cycle: "月", light: "red" },
    { name: "KPI 資料完整率", measure: "已填報且通過檢核的 KPI 比例", target: 98, actual: 96, unit: "%", direction: "越高越好", cycle: "週", light: "yellow" },
    { name: "關鍵任務逾期件數", measure: "跨部門任務逾期數", target: 3, actual: 2, unit: "件", direction: "越低越好", cycle: "週", light: "green" },
    { name: "員工工時落點", measure: "專案投入比例區間", target: "20-40", actual: 45, unit: "%", direction: "區間型", cycle: "月", light: "yellow" }
  ],
  dashboard: {
    scopes: ["公司級", "部門級", "任務組織級", "個人級"],
    summary: [
      { label: "紅燈", value: 6, light: "red", reason: "更新逾期、目標差異或里程碑逾期" },
      { label: "黃燈", value: 12, light: "yellow", reason: "進度偏差接近門檻" },
      { label: "綠燈", value: 34, light: "green", reason: "符合計畫與更新週期" },
      { label: "灰燈", value: 3, light: "gray", reason: "資料尚未啟用或缺少基準" },
      { label: "藍燈", value: 5, light: "blue", reason: "草稿、送審或新建觀察期" }
    ],
    decisionItems: [
      "跨部門資源投入比例需主管決策",
      "M1 更新逾期需確認責任人",
      "Q3 版本發布範圍待核准"
    ]
  },
  jobDescriptions: [
    {
      job: "策略績效管理師",
      purpose: "維護 OGSM 與 KPI 治理節奏",
      responsibilities: ["策略節點版本管理", "KPI 週期追蹤", "跨部門待辦彙整"],
      ksa: ["策略拆解", "資料分析", "利害關係人溝通"],
      status: "核准"
    },
    {
      job: "HRBP",
      purpose: "協助組織能力與職務體系落地",
      responsibilities: ["職務說明書維護", "任職歷程檢核", "績效流程支援"],
      ksa: ["組織設計", "人才盤點", "制度溝通"],
      status: "送審"
    }
  ],
  workLogs: [
    { date: "2026-06-16", employee: "範例主管 A", task: "OGSM 版本送審", hours: 2.5, progress: "70%", status: "草稿", next: "補齊 KPI 關聯" },
    { date: "2026-06-15", employee: "範例專員 B", task: "KPI 資料檢核", hours: 4, progress: "完成", status: "確認", next: "產生稽核紀錄" }
  ],
  approvals: [
    { item: "Q3 OGSM 版本", requester: "策略發展部", reviewer: "指定審核人 C", status: "送審", reason: "版本發布" },
    { item: "工作日誌 KPI 更新", requester: "人力資源部", reviewer: "直屬主管", status: "退回", reason: "需補充成果說明" }
  ],
  auditLogs: [
    { action: "UPDATE", actor: "demo@example.com", target: "ogsm_node:M1", reason: "調整更新週期", before: "月", after: "週", time: "2026-06-16 09:30" },
    { action: "APPROVE", actor: "reviewer@example.com", target: "work_log:demo-002", reason: "確認後更新進度", before: "送出", after: "確認", time: "2026-06-16 10:10" }
  ]
};
