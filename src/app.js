import { MockDataService } from "./services/mock-data-service.js";
import { SupabaseDataService } from "./services/supabase-data-service.js";

const moduleTabs = [
  { id: "home", label: "個人首頁" },
  { id: "org", label: "組織圖與工作職掌定位" },
  { id: "taskorg", label: "橫向組織工作職掌定位" },
  { id: "ogsm", label: "OGSM" },
  { id: "kpi", label: "KPI" },
  { id: "dashboard", label: "Dashboard 戰情" },
  { id: "job", label: "職務說明書" },
  { id: "worklog", label: "工作日誌" },
  { id: "approval", label: "審核稽核" }
];

const lightLabels = { red: "紅", yellow: "黃", green: "綠", gray: "灰", blue: "藍" };
const ogsmTypeLabels = {
  O: "Objective 最終目的",
  G: "Goal 具體目標",
  S: "Strategy 策略",
  M_D: "Measure Dashboard 衡量指標",
  M_P: "Measure Plans 行動計畫"
};

const state = {
  activeTab: "home",
  ogsmView: "tree",
  ogsmFilter: "all",
  selectedAnomalyId: "anom-001",
  selectedPresetId: "preset-hr-training",
  lightReason: null,
  user: null,
  data: {}
};

async function loadConfig() {
  return globalThis.ICAP_CONFIG ?? { dataMode: "mock" };
}

async function createDataService() {
  const config = await loadConfig();
  if (config.dataMode === "supabase" && config.supabaseUrl && config.supabaseAnonKey) {
    return new SupabaseDataService(config);
  }
  return new MockDataService();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function tag(text, tone = "neutral") {
  return `<span class="tag tag-${tone}">${escapeHtml(text)}</span>`;
}

function card(title, body, extraClass = "") {
  return `<section class="panel ${extraClass}"><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function list(items, renderer) {
  return `<div class="list">${items.map(renderer).join("")}</div>`;
}

function lightDot(light, reason) {
  const label = lightLabels[light] ?? "灰";
  return `<button class="light light-${light}" data-reason="${escapeHtml(reason)}" aria-label="${label}燈：${escapeHtml(reason)}">${label}</button>`;
}

function percentBar(value) {
  return `<div class="bar"><span style="width:${Math.max(0, Math.min(100, Number(value) || 0))}%"></span></div>`;
}

function renderShell() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">V4.4</span>
        <div>
          <strong>策略人資績效整合</strong>
          <small>展示板</small>
        </div>
      </div>
      <nav class="nav-tabs" aria-label="展示模組">
        ${moduleTabs.map((tab) => `<button class="${state.activeTab === tab.id ? "active" : ""}" data-tab="${tab.id}">${tab.label}</button>`).join("")}
      </nav>
    </aside>
    <main class="main">
      <header class="topbar">
        <div>
          <p class="eyebrow">企業策略、人力資源與績效整合管理系統展示板</p>
          <h1>${moduleTabs.find((tab) => tab.id === state.activeTab)?.label}</h1>
        </div>
        <div class="user-box">
          <strong>${state.user.name}</strong>
          <span>${state.user.roles.join(" / ")}</span>
        </div>
      </header>
      <div class="role-strip">${state.user.roles.map((role) => tag(role, "role")).join("")}</div>
      <section id="content" class="content"></section>
    </main>
  `;
  app.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      state.lightReason = null;
      renderShell();
    });
  });
  renderActiveTab();
}

function renderActiveTab() {
  const content = document.querySelector("#content");
  const renderers = {
    home: renderHome,
    org: renderOrg,
    taskorg: renderTaskOrg,
    ogsm: renderOgsm,
    kpi: renderKpi,
    dashboard: renderDashboard,
    job: renderJob,
    worklog: renderWorkLog,
    approval: renderApproval
  };
  content.innerHTML = renderers[state.activeTab]();
  bindCommonEvents(content);
}

function bindCommonEvents(content) {
  content.querySelectorAll("[data-reason]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lightReason = button.dataset.reason;
      renderLightReason();
    });
  });
  content.querySelectorAll("[data-open-worklog]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedPresetId = button.dataset.openWorklog;
      state.activeTab = "worklog";
      renderShell();
    });
  });
  content.querySelectorAll("[data-ogsm-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ogsmView = button.dataset.ogsmView;
      renderActiveTab();
    });
  });
  content.querySelectorAll("[data-ogsm-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ogsmFilter = button.dataset.ogsmFilter;
      renderActiveTab();
    });
  });
  content.querySelectorAll("[data-anomaly]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedAnomalyId = button.dataset.anomaly;
      renderActiveTab();
    });
  });
  content.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedPresetId = button.dataset.preset;
      renderActiveTab();
    });
  });
  renderLightReason();
}

function renderLightReason() {
  const host = document.querySelector("#light-reason");
  if (!host) return;
  host.innerHTML = state.lightReason
    ? `<strong>燈號原因</strong><span>${escapeHtml(state.lightReason)}</span>`
    : `<strong>燈號原因</strong><span>點擊任一燈號查看形成原因。</span>`;
}

function renderHome() {
  const h = state.data.homeSummary;
  const todos = [...h.todayTodos, ...h.upcoming, ...h.overdue];
  return `
    <div class="grid metrics">
      ${card("今日待辦", `<strong class="metric">${h.todayTodos.length}</strong><span>可由任務、OGSM Plans、KPI 週期與審核流程自動帶入</span><button class="primary" data-open-worklog="${h.todayTodos[0].workLogPresetId}">建立工作日誌</button>`)}
      ${card("逾期工作", `<strong class="metric danger">${h.overdue.length}</strong><span>需主管或任務負責人追蹤</span>`)}
      ${card("即將到期", `<strong class="metric warn">${h.upcoming.length}</strong><span>7 日內到期</span>`)}
      ${card("待審核事項", `<strong class="metric">${h.approvals}</strong><span>含送審、退回與核准流程</span>`)}
    </div>
    <div class="grid two">
      ${card("待辦來源規則", list(h.todoSources, (source) => `
        <article class="row-card wide">
          <div><strong>${escapeHtml(source.name)}</strong><span>${escapeHtml(source.description)}</span></div>
        </article>
      `))}
      ${card("每日工作檢核", list(h.checklist, (item) => `<label class="check"><input type="checkbox" ${item.done ? "checked" : ""} />${escapeHtml(item.label)}</label>`))}
    </div>
    ${card("待辦清單", list(todos, (item) => `
      <article class="row-card">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.owner ?? `${item.days} 天逾期`)}｜來源：${escapeHtml(item.source)}</span>
        </div>
        <div class="row-actions">
          ${lightDot(item.light ?? "green", `${item.title} 由 ${item.source} 產生，並依期限、審核狀態與更新週期計算燈號。`)}
          <button class="secondary" data-open-worklog="${item.workLogPresetId}">帶入日誌</button>
        </div>
      </article>
    `))}
    <aside id="light-reason" class="reason-box"></aside>
  `;
}

function renderOrg() {
  const org = state.data.organizations;
  return `
    <div class="grid two">
      ${card("組織圖", `<div class="tree">${org.departments.map((department) => `
        <div class="tree-node level-${department.parentId ? "S" : "O"}">
          ${tag(department.parentId ? "部門" : "公司", "role")}
          <strong>${escapeHtml(department.name)}</strong>
          <span>${escapeHtml(department.mission)}｜負責人：${escapeHtml(department.owner)}</span>
        </div>
      `).join("")}</div>`)}
      ${card("員工定位", list(org.employees, (employee) => `
        <article class="row-card wide">
          <div>
            <strong>${escapeHtml(employee.displayName)}</strong>
            <span>${escapeHtml(employee.department)}｜${escapeHtml(employee.position)}｜${escapeHtml(employee.grade)}</span>
            <small>主管：${escapeHtml(employee.manager)}｜審核：${escapeHtml(employee.reviewer)}</small>
          </div>
        </article>
      `))}
    </div>
    ${card("部門工作項目定位", `<div class="table-wrap"><table>
      <thead><tr><th>工作項目</th><th>負責部門</th><th>頻率</th><th>權重</th><th>產出物</th></tr></thead>
      <tbody>${org.workItems.map((item) => `
        <tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.ownerDept)}</td><td>${escapeHtml(item.frequency)}</td><td>${item.weight}%</td><td>${escapeHtml(item.output)}</td></tr>
      `).join("")}</tbody>
    </table></div>`)}
  `;
}

function renderTaskOrg() {
  return `
    ${card("橫向組織工作職掌定位", list(state.data.taskOrganizations, (item) => `
      <article class="row-card wide">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.type)}｜主要負責人：${escapeHtml(item.lead)}｜關聯 ${escapeHtml(item.ogsm)}</span>
          <p>${escapeHtml(item.charter)}</p>
        </div>
        <small>${item.members} 位成員<br />投入 ${escapeHtml(item.allocation)}</small>
      </article>
    `))}
    ${card("人力資源專案職掌拆解", list(state.data.taskOrganizations[0].responsibilities, (item) => `
      <article class="row-card">
        <div><strong>${escapeHtml(item.role)}｜${escapeHtml(item.unit)}</strong><span>${escapeHtml(item.duty)}</span></div>
      </article>
    `))}
  `;
}

function renderOgsm() {
  const ogsm = state.data.ogsm;
  const filters = [
    { id: "all", label: "整體" },
    { id: "O", label: "整體 O" },
    { id: "G", label: "整體 G" },
    { id: "S", label: "整體 S" },
    { id: "M_P", label: "整體 P" },
    { id: "M_D", label: "整體 D" }
  ];
  const nodes = state.ogsmFilter === "all" ? ogsm.nodes : ogsm.nodes.filter((node) => node.type === state.ogsmFilter);
  return `
    ${card("OGSM 定義", `<div class="definition-grid">${ogsm.definitions.map((item) => `
      <article class="mini-card"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.prompt)}</span></article>
    `).join("")}</div>`)}
    <div class="scope-tabs">
      <button class="${state.ogsmView === "tree" ? "active-soft" : ""}" data-ogsm-view="tree">樹狀檢視</button>
      <button class="${state.ogsmView === "network" ? "active-soft" : ""}" data-ogsm-view="network">網狀對應</button>
      <button class="${state.ogsmView === "plans" ? "active-soft" : ""}" data-ogsm-view="plans">Plans 作業</button>
      <button class="${state.ogsmView === "independent" ? "active-soft" : ""}" data-ogsm-view="independent">獨立檢視</button>
    </div>
    ${state.ogsmView === "tree" ? renderOgsmTree(ogsm.nodes) : ""}
    ${state.ogsmView === "network" ? renderOgsmNetwork(ogsm) : ""}
    ${state.ogsmView === "plans" ? renderOgsmPlans(ogsm.plans) : ""}
    ${state.ogsmView === "independent" ? `
      <div class="scope-tabs">${filters.map((filter) => `<button class="${state.ogsmFilter === filter.id ? "active-soft" : ""}" data-ogsm-filter="${filter.id}">${filter.label}</button>`).join("")}</div>
      ${renderOgsmIndependent(nodes)}
    ` : ""}
    <aside id="light-reason" class="reason-box"></aside>
  `;
}

function renderOgsmTree(nodes) {
  return card("樹狀檢視：O 下展開多個 G，G 下展開多個 S，再連到 D/P", `<div class="tree">${nodes.map((node) => `
    <div class="tree-node level-${node.type}">
      ${tag(ogsmTypeLabels[node.type] ?? node.type, "role")}
      <strong>${escapeHtml(node.id)} ${escapeHtml(node.title)}</strong>
      <span>${escapeHtml(node.owner)}｜${escapeHtml(node.status)}｜${escapeHtml(node.description)}</span>
      ${lightDot(node.light, `${node.id} 依更新週期、審核狀態、KPI 連結、Plans 期限與依賴風險計算。`)}
    </div>
  `).join("")}</div>`);
}

function renderOgsmNetwork(ogsm) {
  const nodeMap = new Map(ogsm.nodes.map((node) => [node.id, node]));
  return card("網狀對應：代號、主旨與關係", list(ogsm.relations, (relation) => {
    const from = nodeMap.get(relation.from);
    const to = nodeMap.get(relation.to);
    return `
      <article class="row-card wide">
        <div>
          <strong>${escapeHtml(relation.from)} ${escapeHtml(from?.title ?? "")} → ${escapeHtml(relation.to)} ${escapeHtml(to?.title ?? "")}</strong>
          <span>${escapeHtml(relation.subject)}</span>
        </div>
        ${tag(relation.type, "role")}
      </article>
    `;
  }));
}

function renderOgsmPlans(plans) {
  const first = plans[0];
  return `
    <div class="grid two">
      ${card("Plans 行動計畫輸入", `
        <form class="demo-form">
          <label>行動計畫<input value="${escapeHtml(first.title)}" /></label>
          <label>負責單位<input value="${escapeHtml(first.ownerUnit)}" /></label>
          <label>協作單位<input value="${escapeHtml(first.collaborateUnit)}" /></label>
          <label>期限<input type="date" value="${escapeHtml(first.due)}" /></label>
          <label>產出物<textarea>${escapeHtml(first.deliverable)}</textarea></label>
          <label>進度<input type="number" value="${first.progress}" min="0" max="100" /></label>
          <button type="button" class="primary">儲存草稿</button>
          <button type="button" class="secondary">送審</button>
        </form>
      `)}
      ${card("Plans 更新與顯示方式", list(plans, (plan) => `
        <article class="row-card wide">
          <div>
            <strong>${escapeHtml(plan.id)} ${escapeHtml(plan.title)}</strong>
            <span>負責：${escapeHtml(plan.ownerUnit)}｜協作：${escapeHtml(plan.collaborateUnit)}｜期限：${escapeHtml(plan.due)}</span>
            <p>產出物：${escapeHtml(plan.deliverable)}</p>
            ${percentBar(plan.progress)}
            <small>${escapeHtml(plan.updateMethod)}</small>
          </div>
          ${tag(plan.status, plan.status === "送審" ? "warn" : "role")}
        </article>
      `))}
    </div>
  `;
}

function renderOgsmIndependent(nodes) {
  return card("獨立檢視：類型、擁有者與主旨", `<div class="table-wrap"><table>
    <thead><tr><th>類型</th><th>代號</th><th>主旨</th><th>擁有者</th><th>狀態</th><th>燈號</th></tr></thead>
    <tbody>${nodes.map((node) => `
      <tr>
        <td>${escapeHtml(ogsmTypeLabels[node.type] ?? node.type)}</td>
        <td>${escapeHtml(node.id)}</td>
        <td>${escapeHtml(node.title)}</td>
        <td>${escapeHtml(node.owner)}</td>
        <td>${escapeHtml(node.status)}</td>
        <td>${lightDot(node.light, `${node.id} 的燈號來自期限、進度、審核與依賴狀態。`)}</td>
      </tr>
    `).join("")}</tbody>
  </table></div>`);
}

function renderKpi() {
  return card("KPI 與 Measure Dashboard", `<div class="table-wrap"><table>
    <thead><tr><th>KPI</th><th>Measure</th><th>目標</th><th>實績</th><th>週期</th><th>燈號</th></tr></thead>
    <tbody>${state.data.kpis.map((kpi) => `
      <tr>
        <td>${escapeHtml(kpi.name)}<br /><small>${escapeHtml(kpi.direction)}</small></td>
        <td>${escapeHtml(kpi.measure)}</td>
        <td>${escapeHtml(kpi.target)}${escapeHtml(kpi.unit)}</td>
        <td>${escapeHtml(kpi.actual)}${escapeHtml(kpi.unit)}</td>
        <td>${escapeHtml(kpi.cycle)}</td>
        <td>${lightDot(kpi.light, `${kpi.name} 由目標差異、更新週期、里程碑與風險狀態形成。`)}</td>
      </tr>
    `).join("")}</tbody>
  </table></div>`) + `<aside id="light-reason" class="reason-box"></aside>`;
}

function renderDashboard() {
  const dashboard = state.data.dashboard;
  const selected = dashboard.anomalies.find((item) => item.id === state.selectedAnomalyId) ?? dashboard.anomalies[0];
  return `
    <div class="scope-tabs">${dashboard.scopes.map((scope) => `<button>${escapeHtml(scope)}</button>`).join("")}</div>
    <div class="grid metrics">
      ${dashboard.summary.map((item) => card(item.label, `<strong class="metric">${item.value}</strong>${lightDot(item.light, item.reason)}`)).join("")}
    </div>
    <div class="grid two">
      ${card("戰情異常總表", list(dashboard.anomalies, (item) => `
        <button class="row-card button-row ${state.selectedAnomalyId === item.id ? "selected" : ""}" data-anomaly="${item.id}">
          <div><strong>${escapeHtml(item.area)}｜${escapeHtml(item.title)}</strong><span>負責：${escapeHtml(item.owner)}｜期限：${escapeHtml(item.due)}</span></div>
          ${lightDot(item.light, item.rootCause)}
        </button>
      `))}
      ${card("異常細項", `
        <article class="detail-box">
          <strong>${escapeHtml(selected.title)}</strong>
          <span>${escapeHtml(selected.area)}｜負責：${escapeHtml(selected.owner)}｜期限：${escapeHtml(selected.due)}</span>
          <h3>異常內容</h3>
          <p>${escapeHtml(selected.rootCause)}</p>
          <h3>下一步</h3>
          <p>${escapeHtml(selected.nextAction)}</p>
        </article>
      `)}
    </div>
    ${card("待主管決策", list(dashboard.decisionItems, (item) => `<article class="row-card"><strong>${escapeHtml(item)}</strong>${tag("待決策", "warn")}</article>`))}
    <aside id="light-reason" class="reason-box"></aside>
  `;
}

function renderJob() {
  return card("職務說明書：由組織工作項目繼承展開", list(state.data.jobDescriptions, (job) => `
    <article class="row-card wide">
      <div>
        <strong>${escapeHtml(job.job)}</strong>
        <span>${escapeHtml(job.purpose)}</span>
        <div class="table-wrap compact"><table>
          <thead><tr><th>繼承工作項目</th><th>頻率</th><th>權重</th><th>產出物</th></tr></thead>
          <tbody>${job.inheritedWorkItems.map((item) => `
            <tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.frequency)}</td><td>${item.weight}%</td><td>${escapeHtml(item.output)}</td></tr>
          `).join("")}</tbody>
        </table></div>
        <small>K/S/A：${job.ksa.map(escapeHtml).join("、")}</small>
      </div>
      ${tag(job.status, job.status === "核准" ? "role" : "warn")}
    </article>
  `));
}

function renderWorkLog() {
  const presets = state.data.workLogPresets;
  const preset = presets.find((item) => item.id === state.selectedPresetId) ?? presets[0];
  return `
    <div class="scope-tabs">${presets.map((item) => `<button class="${state.selectedPresetId === item.id ? "active-soft" : ""}" data-preset="${item.id}">${escapeHtml(item.source)}</button>`).join("")}</div>
    <div class="grid two">
      ${card("工作日誌建立畫面", `
        <form class="demo-form">
          <label>日期<input type="date" value="2026-06-16" /></label>
          <label>員工<input value="${escapeHtml(preset.employee)}" /></label>
          <label>任務<input value="${escapeHtml(preset.task)}" /></label>
          <label>部門工作項目<input value="${escapeHtml(preset.departmentWorkItem)}" /></label>
          <label>OGSM<input value="${escapeHtml(preset.ogsm)}" /></label>
          <label>KPI<input value="${escapeHtml(preset.kpi)}" /></label>
          <label>專案<input value="${escapeHtml(preset.project)}" /></label>
          <label>實際工作內容<textarea>${escapeHtml(preset.content)}</textarea></label>
          <label>成果<textarea>${escapeHtml(preset.result)}</textarea></label>
          <label>工時<input type="number" value="${preset.hours}" /></label>
          <label>進度<input type="number" value="${preset.progress}" /></label>
          <label>問題<textarea>${escapeHtml(preset.issue)}</textarea></label>
          <label>所需支援<textarea>${escapeHtml(preset.supportNeeded)}</textarea></label>
          <label>下一步<textarea>${escapeHtml(preset.nextStep)}</textarea></label>
          <button type="button" class="primary">儲存草稿</button>
          <button type="button" class="secondary">送出審核</button>
        </form>
      `)}
      ${card("已建立工作日誌", list(state.data.workLogs, (log) => `
        <article class="row-card wide">
          <div>
            <strong>${escapeHtml(log.date)}｜${escapeHtml(log.task)}</strong>
            <span>${escapeHtml(log.employee)}｜${escapeHtml(log.project)}｜${escapeHtml(log.hours)} 小時｜進度 ${escapeHtml(log.progress)}</span>
            <p>${escapeHtml(log.departmentWorkItem)}｜${escapeHtml(log.ogsm)}｜${escapeHtml(log.kpi)}</p>
            <small>下一步：${escapeHtml(log.next)}</small>
          </div>
          ${tag(log.status, log.status === "確認" ? "role" : "warn")}
        </article>
      `) + `<p class="note">工作日誌引用人力資源專案設計：任務、部門工作項目、OGSM、KPI 與專案會自動帶入；正式 KPI 數值需經確認後才更新。</p>`)}
    </div>
  `;
}

function renderApproval() {
  return `
    <div class="grid two">
      ${card("審核流程", list(state.data.approvals, (approval) => `
        <article class="row-card"><div><strong>${escapeHtml(approval.item)}</strong><span>${escapeHtml(approval.requester)} → ${escapeHtml(approval.reviewer)}｜${escapeHtml(approval.reason)}</span></div>${tag(approval.status, approval.status === "退回" ? "warn" : "role")}</article>
      `))}
      ${card("Audit Log", list(state.data.auditLogs, (log) => `
        <article class="row-card wide"><div><strong>${escapeHtml(log.action)} ${escapeHtml(log.target)}</strong><span>${escapeHtml(log.actor)}｜${escapeHtml(log.time)}</span><p>${escapeHtml(log.reason)}：${escapeHtml(log.before)} → ${escapeHtml(log.after)}</p></div></article>
      `))}
    </div>
  `;
}

async function bootstrap() {
  const service = await createDataService();
  state.user = await service.getCurrentUser();
  const [
    homeSummary,
    organizations,
    taskOrganizations,
    ogsm,
    kpis,
    dashboard,
    jobDescriptions,
    workLogs,
    approvals,
    auditLogs
  ] = await Promise.all([
    service.getHomeSummary(),
    service.getOrganizations(),
    service.getTaskOrganizations?.() ?? [],
    service.getOgsm(),
    service.getKpis(),
    service.getDashboard(),
    service.getJobDescriptions(),
    service.getWorkLogs(),
    service.getApprovals(),
    service.getAuditLogs?.() ?? []
  ]);
  state.data = {
    homeSummary,
    organizations,
    taskOrganizations,
    ogsm,
    kpis,
    dashboard,
    jobDescriptions,
    workLogs,
    approvals,
    auditLogs,
    workLogPresets: service.getWorkLogPresets ? await service.getWorkLogPresets() : []
  };
  renderShell();
}

bootstrap().catch((error) => {
  document.querySelector("#app").innerHTML = `<main class="error"><h1>載入失敗</h1><p>${escapeHtml(error.message)}</p></main>`;
});
