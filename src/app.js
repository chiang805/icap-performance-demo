import { MockDataService } from "./services/mock-data-service.js";
import { SupabaseDataService } from "./services/supabase-data-service.js";

const moduleTabs = [
  { id: "home", label: "個人首頁" },
  { id: "org", label: "員工與組織" },
  { id: "taskorg", label: "任務組織" },
  { id: "ogsm", label: "OGSM" },
  { id: "kpi", label: "KPI" },
  { id: "dashboard", label: "Dashboard" },
  { id: "job", label: "職務說明書" },
  { id: "worklog", label: "工作日誌" },
  { id: "approval", label: "審核稽核" }
];

const lightLabels = {
  red: "紅",
  yellow: "黃",
  green: "綠",
  gray: "灰",
  blue: "藍"
};

const state = {
  activeTab: "home",
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

function tag(text, tone = "neutral") {
  return `<span class="tag tag-${tone}">${text}</span>`;
}

function lightDot(light, reason) {
  const label = lightLabels[light] ?? "灰";
  return `<button class="light light-${light}" data-reason="${escapeHtml(reason)}" aria-label="${label}燈：${escapeHtml(reason)}">${label}</button>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function card(title, body, extraClass = "") {
  return `<section class="panel ${extraClass}"><h2>${title}</h2>${body}</section>`;
}

function list(items, renderer) {
  return `<div class="list">${items.map(renderer).join("")}</div>`;
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
      <div class="role-strip">
        ${state.user.roles.map((role) => tag(role, "role")).join("")}
      </div>
      <section id="content" class="content"></section>
    </main>
  `;
  app.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      renderShell();
      renderActiveTab();
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
  content.querySelectorAll("[data-reason]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lightReason = button.dataset.reason;
      renderLightReason();
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
  return `
    <div class="grid metrics">
      ${card("今日待辦", `<strong class="metric">${h.todayTodos.length}</strong><span>可快速建立工作日誌</span><button class="primary">建立工作日誌</button>`)}
      ${card("逾期工作", `<strong class="metric danger">${h.overdue.length}</strong><span>需主管或任務負責人追蹤</span>`)}
      ${card("即將到期", `<strong class="metric warn">${h.upcoming.length}</strong><span>7 日內到期</span>`)}
      ${card("待審核事項", `<strong class="metric">${h.approvals}</strong><span>含送審、退回與核准流程</span>`)}
    </div>
    <div class="grid two">
      ${card("個人工作檢核", list(h.checklist, (item) => `<label class="check"><input type="checkbox" ${item.done ? "checked" : ""} />${item.label}</label>`))}
      ${card("更新提醒", `
        <div class="stat-row"><span>OGSM 待更新</span><strong>${h.ogsmNeedsUpdate}</strong></div>
        <div class="stat-row"><span>KPI 待填報</span><strong>${h.kpiNeedsInput}</strong></div>
        <div class="stat-row"><span>工作日誌</span><strong>${h.workLogCompleted ? "已填" : "未填"}</strong></div>
        <div class="stat-row"><span>跨部門協作</span><strong>${h.collaborations}</strong></div>
      `)}
    </div>
    ${card("待辦清單", list([...h.todayTodos, ...h.upcoming, ...h.overdue], (item) => `
      <article class="row-card">
        <div><strong>${item.title}</strong><span>${item.owner ?? `${item.days} 天逾期`}</span></div>
        ${lightDot(item.light ?? (item.status === "warning" ? "yellow" : "green"), `${item.title} 的狀態來自到期日、更新週期與審核狀態。`)}
      </article>
    `))}
    <aside id="light-reason" class="reason-box"></aside>
  `;
}

function renderOrg() {
  const org = state.data.organizations;
  return `
    <div class="grid two">
      ${card("正式部門多層組織", list(org.departments, (department) => `
        <article class="row-card">
          <div><strong>${department.name}</strong><span>${department.mission}</span></div>
          ${tag(department.parentId ? "子部門" : "根部門")}
        </article>
      `))}
      ${card("員工主檔與任職歷程", list(org.employees, (employee) => `
        <article class="row-card">
          <div><strong>${employee.displayName}</strong><span>${employee.department}｜${employee.position}｜${employee.grade}</span></div>
          <small>主管：${employee.manager}<br />審核：${employee.reviewer}</small>
        </article>
      `))}
    </div>
    ${card("部門工作項目", org.workItems.map((item) => tag(item, "role")).join(""))}
  `;
}

function renderTaskOrg() {
  return card("任務型橫向組織", list(state.data.taskOrganizations, (item) => `
    <article class="row-card">
      <div><strong>${item.name}</strong><span>${item.type}｜主要負責人：${item.lead}｜關聯 ${item.ogsm}</span></div>
      <small>${item.members} 位成員<br />投入 ${item.allocation}</small>
    </article>
  `));
}

function renderOgsm() {
  const ogsm = state.data.ogsm;
  return `
    <div class="grid two">
      ${card("樹狀檢視", `<div class="tree">${ogsm.nodes.map((node) => `
        <div class="tree-node level-${node.type}">
          ${tag(node.type, "role")}
          <strong>${node.id} ${node.title}</strong>
          <span>${node.owner}｜${node.status}</span>
          ${lightDot(node.light, `${node.id} 依更新週期、審核狀態、KPI 連結與依賴風險計算。`)}
        </div>
      `).join("")}</div>`)}
      ${card("網狀關係", list(ogsm.relations, (relation) => `
        <article class="row-card"><strong>${relation.from} → ${relation.to}</strong>${tag(relation.type)}</article>
      `))}
    </div>
    ${card("版本治理", list(ogsm.versions, (version) => `
      <article class="row-card"><div><strong>${version.version}</strong><span>${version.note}</span></div>${tag(version.status, "role")}</article>
    `))}
    <aside id="light-reason" class="reason-box"></aside>
  `;
}

function renderKpi() {
  return `
    ${card("KPI 與 Measure", `<div class="table-wrap"><table>
      <thead><tr><th>KPI</th><th>Measure</th><th>目標</th><th>實績</th><th>週期</th><th>燈號</th></tr></thead>
      <tbody>${state.data.kpis.map((kpi) => `
        <tr>
          <td>${kpi.name}<br /><small>${kpi.direction}</small></td>
          <td>${kpi.measure}</td>
          <td>${kpi.target}${kpi.unit}</td>
          <td>${kpi.actual}${kpi.unit}</td>
          <td>${kpi.cycle}</td>
          <td>${lightDot(kpi.light, `${kpi.name} 由目標差異、更新週期、里程碑與風險狀態形成。`)}</td>
        </tr>
      `).join("")}</tbody>
    </table></div>`)}
    <aside id="light-reason" class="reason-box"></aside>
  `;
}

function renderDashboard() {
  const dashboard = state.data.dashboard;
  return `
    <div class="scope-tabs">${dashboard.scopes.map((scope) => `<button>${scope}</button>`).join("")}</div>
    <div class="grid metrics">
      ${dashboard.summary.map((item) => card(item.label, `<strong class="metric">${item.value}</strong>${lightDot(item.light, item.reason)}`)).join("")}
    </div>
    ${card("待主管決策", list(dashboard.decisionItems, (item) => `<article class="row-card"><strong>${item}</strong>${tag("待決策", "warn")}</article>`))}
    <aside id="light-reason" class="reason-box"></aside>
  `;
}

function renderJob() {
  return card("職務說明書", list(state.data.jobDescriptions, (job) => `
    <article class="row-card wide">
      <div>
        <strong>${job.job}</strong>
        <span>${job.purpose}</span>
        <p>${job.responsibilities.join("、")}</p>
        <small>K/S/A：${job.ksa.join("、")}</small>
      </div>
      ${tag(job.status, job.status === "核准" ? "role" : "warn")}
    </article>
  `));
}

function renderWorkLog() {
  return card("工作日誌", list(state.data.workLogs, (log) => `
    <article class="row-card wide">
      <div><strong>${log.date}｜${log.task}</strong><span>${log.employee}｜${log.hours} 小時｜進度 ${log.progress}</span><p>下一步：${log.next}</p></div>
      ${tag(log.status, log.status === "確認" ? "role" : "warn")}
    </article>
  `) + `<p class="note">工作日誌不直接修改正式 KPI 數值，須經確認後更新。</p>`);
}

function renderApproval() {
  return `
    <div class="grid two">
      ${card("審核流程", list(state.data.approvals, (approval) => `
        <article class="row-card"><div><strong>${approval.item}</strong><span>${approval.requester} → ${approval.reviewer}</span></div>${tag(approval.status, approval.status === "退回" ? "warn" : "role")}</article>
      `))}
      ${card("Audit Log", list(state.data.auditLogs, (log) => `
        <article class="row-card wide"><div><strong>${log.action} ${log.target}</strong><span>${log.actor}｜${log.time}</span><p>${log.reason}：${log.before} → ${log.after}</p></div></article>
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
  state.data = { homeSummary, organizations, taskOrganizations, ogsm, kpis, dashboard, jobDescriptions, workLogs, approvals, auditLogs };
  renderShell();
}

bootstrap().catch((error) => {
  document.querySelector("#app").innerHTML = `<main class="error"><h1>載入失敗</h1><p>${escapeHtml(error.message)}</p></main>`;
});
