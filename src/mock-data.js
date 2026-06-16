export const mockData = {
  currentUser: {
    id: "demo-user-001",
    name: "展示使用者",
    account: "demo@example.com",
    roles: ["Admin", "HR", "Manager", "Task Leader", "Executive Viewer"],
    functionPermissions: ["dashboard:view", "ogsm:edit", "ogsm:review", "worklog:create", "worklog:confirm", "audit:view"],
    dataScopes: ["company", "department:hr", "department:strategy", "task_org:hr-project"]
  },
  homeSummary: {
    todayTodos: [
      {
        id: "todo-001",
        title: "建立 HR 專案工作日誌",
        owner: "人力資源專案",
        source: "專案任務自動帶入",
        due: "今日",
        status: "pending",
        light: "blue",
        workLogPresetId: "preset-hr-training"
      },
      {
        id: "todo-002",
        title: "確認人才盤點 KPI 實績",
        owner: "人力資源部",
        source: "KPI 更新週期產生",
        due: "今日",
        status: "warning",
        light: "yellow",
        workLogPresetId: "preset-kpi-check"
      }
    ],
    overdue: [
      {
        id: "todo-003",
        title: "職務說明書權重校準",
        days: 2,
        source: "審核退回自動產生",
        light: "red",
        workLogPresetId: "preset-job-review"
      }
    ],
    upcoming: [
      {
        id: "todo-004",
        title: "Q3 OGSM Plans 行動計畫送審",
        due: "3 天後",
        source: "OGSM 版本節點產生",
        light: "yellow",
        workLogPresetId: "preset-ogsm-plan"
      },
      {
        id: "todo-005",
        title: "新人訓練專案週會",
        due: "5 天後",
        source: "人力資源專案會議節奏",
        light: "green",
        workLogPresetId: "preset-hr-training"
      }
    ],
    ogsmNeedsUpdate: 7,
    kpiNeedsInput: 5,
    workLogCompleted: false,
    approvals: 6,
    collaborations: 9,
    checklist: [
      { label: "檢查今日待辦來源", done: true },
      { label: "建立人力資源專案工作日誌", done: false },
      { label: "確認 OGSM Plans 進度", done: false },
      { label: "回覆待審核事項", done: true }
    ],
    todoSources: [
      { name: "專案任務", description: "由 work_task 與 task_organization_member 依負責人與期限帶入。" },
      { name: "OGSM Plans", description: "由 M(P) 行動計畫的負責單位、協作單位、期限與產出物帶入。" },
      { name: "KPI 更新週期", description: "由 kpi_definition.update_cycle 與 reporting_period 判斷待填報。" },
      { name: "審核退回", description: "由 approval_request 與 work_log_review 的退回狀態產生。" }
    ]
  },
  organizations: {
    departments: [
      { id: "corp", name: "總經理室", parentId: null, mission: "公司策略節奏與治理", owner: "執行長" },
      { id: "strategy", name: "策略發展部", parentId: "corp", mission: "OGSM 展開與績效追蹤", owner: "策略長" },
      { id: "hr", name: "人力資源部", parentId: "corp", mission: "組織能力、人才發展與工作職掌制度", owner: "人資主管" },
      { id: "ops", name: "營運管理部", parentId: "corp", mission: "流程改善、交付品質與績效資料品質", owner: "營運主管" }
    ],
    employees: [
      { code: "E-DEMO-001", displayName: "範例主管 A", department: "人力資源部", position: "HR 專案負責人", grade: "M2", manager: "範例主管 B", reviewer: "指定審核人 C" },
      { code: "E-DEMO-002", displayName: "範例專員 B", department: "人力資源部", position: "HRBP", grade: "P3", manager: "範例主管 A", reviewer: "指定審核人 C" },
      { code: "E-DEMO-003", displayName: "範例專員 C", department: "策略發展部", position: "績效管理師", grade: "P3", manager: "範例主管 A", reviewer: "範例主管 B" }
    ],
    workItems: [
      { id: "wi-hr-001", name: "職務說明書維護", frequency: "季", weight: 20, output: "核准版職務說明書", ownerDept: "人力資源部" },
      { id: "wi-hr-002", name: "人才盤點與訓練專案", frequency: "月", weight: 25, output: "人才盤點表與訓練追蹤", ownerDept: "人力資源部" },
      { id: "wi-hr-003", name: "績效流程與 KPI 檢核", frequency: "月", weight: 30, output: "KPI 檢核紀錄", ownerDept: "人力資源部" },
      { id: "wi-st-001", name: "OGSM 版本治理", frequency: "月", weight: 25, output: "OGSM 發布版", ownerDept: "策略發展部" }
    ]
  },
  taskOrganizations: [
    {
      type: "人力資源專案",
      name: "新人訓練與職能盤點專案",
      lead: "範例主管 A",
      members: 8,
      allocation: "20%-60%",
      ogsm: "M(P)-P1 新人訓練行動計畫",
      charter: "整合訓練、職能盤點、工作日誌與績效檢核",
      responsibilities: [
        { role: "主要負責人", unit: "人力資源部", duty: "專案範疇、期限與產出物確認" },
        { role: "協作單位", unit: "營運管理部", duty: "提供流程訓練教材與現場導師" },
        { role: "績效支援", unit: "策略發展部", duty: "連結 OGSM 與 Dashboard 指標" }
      ]
    },
    {
      type: "改善小組",
      name: "KPI 資料品質改善",
      lead: "範例專員 B",
      members: 5,
      allocation: "10%-30%",
      ogsm: "M(D)-D2 KPI 資料完整率",
      charter: "降低 KPI 缺漏與逾期更新"
    },
    {
      type: "委員會",
      name: "績效校準委員會",
      lead: "範例主管 C",
      members: 10,
      allocation: "5%-15%",
      ogsm: "G1 組織目標達成",
      charter: "審核跨部門目標與資源取捨"
    }
  ],
  ogsm: {
    definitions: [
      { type: "O", name: "Objective 最終目的", prompt: "當我們成功時，我們看起來像什麼樣子？" },
      { type: "G", name: "Goal 具體目標", prompt: "符合 SMART 原則，描述量化目標與期限。" },
      { type: "S", name: "Strategy 策略", prompt: "說明資源取捨與達成路徑。" },
      { type: "M_D", name: "Measure Dashboard 衡量指標", prompt: "對應進度、結果與異常狀態。" },
      { type: "M_P", name: "Measure Plans 行動計畫", prompt: "包含負責單位、協作單位、期限與產出物。" }
    ],
    nodes: [
      { id: "O1", type: "O", title: "建立策略、人資與績效一致的管理節奏", owner: "總經理室", status: "published", light: "green", description: "成功時，主管能在同一戰情頁看到策略、組織、職掌、KPI 與工作日誌的連動。" },
      { id: "G1", type: "G", title: "年度策略目標達成率 90%", owner: "策略發展部", parentId: "O1", status: "review", light: "yellow", description: "2026 年底公司級 OGSM 節點達成率達 90%。" },
      { id: "G2", type: "G", title: "關鍵職務說明書核准率 95%", owner: "人力資源部", parentId: "O1", status: "published", light: "green", description: "關鍵職務需完成項目、頻率、權重與核准狀態。" },
      { id: "G3", type: "G", title: "跨部門專案準時交付率 85%", owner: "營運管理部", parentId: "O1", status: "published", light: "yellow", description: "以任務型橫向組織追蹤準時交付。" },
      { id: "S1", type: "S", title: "建立跨部門目標治理機制", owner: "人力資源部", parentId: "G1", status: "published", light: "green", description: "用會議節奏、資料責任與審核流程固定目標治理。" },
      { id: "S2", type: "S", title: "以工作職掌串接績效資料", owner: "人力資源部", parentId: "G2", status: "published", light: "green", description: "工作項目展開到職務、KPI 與工作日誌。" },
      { id: "S3", type: "S", title: "專案任務與工作日誌整合", owner: "營運管理部", parentId: "G3", status: "review", light: "yellow", description: "任務自動帶入工作日誌，形成每日進度與問題紀錄。" },
      { id: "D1", type: "M_D", title: "OGSM 更新準時率", owner: "策略發展部", parentId: "S1", status: "published", light: "red", description: "衡量每月應更新節點是否準時完成。" },
      { id: "D2", type: "M_D", title: "KPI 資料完整率", owner: "營運管理部", parentId: "S1", status: "published", light: "yellow", description: "衡量 KPI 目標、實績與 check-in 是否完整。" },
      { id: "D3", type: "M_D", title: "職務工作項目覆蓋率", owner: "人力資源部", parentId: "S2", status: "published", light: "green", description: "衡量工作項目是否展開到職務說明書。" },
      { id: "P1", type: "M_P", title: "新人訓練行動計畫", owner: "人力資源部", parentId: "S2", status: "draft", light: "blue", description: "將人力資源專案的訓練任務、工作日誌與成果確認串接。" },
      { id: "P2", type: "M_P", title: "跨部門 KPI 檢核行動計畫", owner: "策略發展部", parentId: "S3", status: "review", light: "yellow", description: "透過協作單位補齊異常 KPI 的根因與改善行動。" }
    ],
    relations: [
      { from: "S1", to: "D2", type: "支援", subject: "治理節奏支援 KPI 資料完整率" },
      { from: "D1", to: "P2", type: "依賴", subject: "更新逾期會觸發跨部門檢核行動" },
      { from: "G2", to: "D3", type: "共背", subject: "職務說明書核准率與工作項目覆蓋率共同承擔" },
      { from: "P1", to: "S2", type: "協作", subject: "新人訓練專案提供職掌落地證據" },
      { from: "S3", to: "P2", type: "支援", subject: "專案任務與工作日誌提供改善追蹤資料" }
    ],
    plans: [
      {
        id: "P1",
        title: "新人訓練行動計畫",
        ownerUnit: "人力資源部",
        collaborateUnit: "營運管理部",
        due: "2026-07-15",
        deliverable: "新人訓練地圖、導師回饋、工作日誌確認紀錄",
        progress: 45,
        status: "草稿",
        updateMethod: "負責人填寫進度與產出物，協作單位補充問題與支援需求，送主管確認後更新 Dashboard。"
      },
      {
        id: "P2",
        title: "跨部門 KPI 檢核行動計畫",
        ownerUnit: "策略發展部",
        collaborateUnit: "人力資源部、營運管理部",
        due: "2026-06-30",
        deliverable: "KPI 異常根因表、改善行動清單、審核紀錄",
        progress: 62,
        status: "送審",
        updateMethod: "由 KPI 異常總表點入建立行動項，完成後由審核人確認。"
      }
    ],
    versions: [
      { version: "4.4.1-demo", status: "發布", approvedBy: "範例審核人", note: "加入 M(D)/M(P)、Plans 與網狀主旨展示" }
    ]
  },
  kpis: [
    { name: "OGSM 更新準時率", measure: "每月完成更新的節點比例", target: 95, actual: 82, unit: "%", direction: "越高越好", cycle: "月", light: "red" },
    { name: "KPI 資料完整率", measure: "已填報且通過檢核的 KPI 比例", target: 98, actual: 96, unit: "%", direction: "越高越好", cycle: "週", light: "yellow" },
    { name: "職務工作項目覆蓋率", measure: "職務說明書已引用部門工作項目的比例", target: 95, actual: 91, unit: "%", direction: "越高越好", cycle: "季", light: "green" },
    { name: "關鍵任務逾期件數", measure: "跨部門任務逾期數", target: 3, actual: 4, unit: "件", direction: "越低越好", cycle: "週", light: "red" }
  ],
  dashboard: {
    scopes: ["公司級", "部門級", "任務組織級", "個人級"],
    summary: [
      { label: "紅燈", value: 7, light: "red", reason: "更新逾期、KPI 重大落後或里程碑逾期。" },
      { label: "黃燈", value: 14, light: "yellow", reason: "進度偏差接近門檻或待協作單位回覆。" },
      { label: "綠燈", value: 36, light: "green", reason: "符合計畫、資料完整且準時更新。" },
      { label: "灰燈", value: 3, light: "gray", reason: "未啟用、缺少基準或尚未進入週期。" },
      { label: "藍燈", value: 5, light: "blue", reason: "草稿、送審或新建觀察期。" }
    ],
    anomalies: [
      { id: "anom-001", area: "OGSM", title: "D1 OGSM 更新準時率落後", light: "red", owner: "策略發展部", rootCause: "S1 下兩個 Measure 節點未在週期內 check-in。", nextAction: "由策略發展部建立 P2 行動計畫並通知協作單位。", due: "2026-06-20" },
      { id: "anom-002", area: "人力資源專案", title: "新人訓練工作日誌缺交", light: "yellow", owner: "人力資源部", rootCause: "專案任務已到期，但兩位成員尚未送出日誌。", nextAction: "從待辦清單快速建立日誌並帶入任務資料。", due: "2026-06-18" },
      { id: "anom-003", area: "職務說明書", title: "職務權重未完成校準", light: "red", owner: "人力資源部", rootCause: "工作項目頻率與權重缺少主管確認。", nextAction: "退回 HRBP 補充頻率與產出物。", due: "2026-06-19" }
    ],
    decisionItems: [
      "新人訓練專案需決定導師投入比例",
      "P2 KPI 檢核行動計畫需確認協作單位期限",
      "職務說明書權重是否納入績效考核"
    ]
  },
  jobDescriptions: [
    {
      job: "HR 專案負責人",
      purpose: "整合人力資源專案、職務職掌、工作日誌與績效追蹤",
      inheritedWorkItems: [
        { name: "人才盤點與訓練專案", frequency: "月", weight: 35, output: "專案週報、訓練完成率、導師回饋" },
        { name: "職務說明書維護", frequency: "季", weight: 25, output: "核准版職務說明書" },
        { name: "績效流程與 KPI 檢核", frequency: "月", weight: 20, output: "KPI 檢核紀錄" }
      ],
      ksa: ["專案管理", "組織設計", "績效制度", "利害關係人溝通"],
      status: "核准"
    },
    {
      job: "HRBP",
      purpose: "協助組織能力與職務體系落地",
      inheritedWorkItems: [
        { name: "職務說明書維護", frequency: "季", weight: 30, output: "工作項目、頻率、權重建議" },
        { name: "人才盤點與訓練專案", frequency: "月", weight: 30, output: "人才盤點表與訓練追蹤" }
      ],
      ksa: ["職務分析", "人才盤點", "制度溝通"],
      status: "送審"
    }
  ],
  workLogPresets: [
    {
      id: "preset-hr-training",
      source: "人力資源專案",
      employee: "範例主管 A",
      task: "新人訓練與職能盤點專案",
      departmentWorkItem: "人才盤點與訓練專案",
      ogsm: "M(P)-P1 新人訓練行動計畫",
      kpi: "職務工作項目覆蓋率",
      project: "人力資源專案",
      content: "彙整新人訓練進度、導師回饋與職能缺口。",
      result: "完成 3 位新人訓練節點檢核。",
      hours: 2.5,
      progress: 45,
      issue: "營運單位導師回覆尚未完整。",
      supportNeeded: "請營運管理部補齊導師觀察紀錄。",
      nextStep: "將缺口轉為下週訓練任務。"
    },
    {
      id: "preset-kpi-check",
      source: "KPI 更新週期",
      employee: "範例專員 B",
      task: "KPI 資料完整率檢核",
      departmentWorkItem: "績效流程與 KPI 檢核",
      ogsm: "M(D)-D2 KPI 資料完整率",
      kpi: "KPI 資料完整率",
      project: "KPI 資料品質改善",
      content: "檢查本週 KPI 目標、實績與 check-in 是否完整。",
      result: "發現 2 筆缺少實績來源。",
      hours: 1.5,
      progress: 60,
      issue: "資料來源單位未上傳佐證。",
      supportNeeded: "請部門窗口補附資料來源。",
      nextStep: "送出異常明細給審核人。"
    }
  ],
  workLogs: [
    { date: "2026-06-16", employee: "範例主管 A", task: "新人訓練與職能盤點專案", project: "人力資源專案", departmentWorkItem: "人才盤點與訓練專案", ogsm: "M(P)-P1", kpi: "職務工作項目覆蓋率", hours: 2.5, progress: "45%", status: "草稿", next: "補齊導師回饋" },
    { date: "2026-06-15", employee: "範例專員 B", task: "KPI 資料檢核", project: "KPI 資料品質改善", departmentWorkItem: "績效流程與 KPI 檢核", ogsm: "M(D)-D2", kpi: "KPI 資料完整率", hours: 4, progress: "完成", status: "確認", next: "產生稽核紀錄" }
  ],
  approvals: [
    { item: "Q3 OGSM Plans 版本", requester: "策略發展部", reviewer: "指定審核人 C", status: "送審", reason: "M(P) 行動計畫發布" },
    { item: "人力資源專案工作日誌", requester: "人力資源部", reviewer: "直屬主管", status: "退回", reason: "需補充產出物與支援需求" }
  ],
  auditLogs: [
    { action: "UPDATE", actor: "demo@example.com", target: "ogsm_node:P1", reason: "補充協作單位與產出物", before: "草稿", after: "送審", time: "2026-06-16 09:30" },
    { action: "APPROVE", actor: "reviewer@example.com", target: "work_log:demo-002", reason: "確認後更新進度", before: "送出", after: "確認", time: "2026-06-16 10:10" }
  ]
};
