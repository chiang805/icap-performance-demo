insert into public.department (code, name, core_mission) values
  ('CORP', '總經理室', '公司策略節奏與治理'),
  ('STRATEGY', '策略發展部', 'OGSM 展開與績效追蹤'),
  ('HR', '人力資源部', '組織能力與人才系統'),
  ('OPS', '營運管理部', '流程改善與交付品質');

insert into public.position (code, name) values
  ('STRATEGY_MANAGER', '策略經理'),
  ('HRBP', 'HRBP'),
  ('OPS_SPECIALIST', '營運管理專員');

insert into public.job_grade (code, name, rank_order) values
  ('M2', '管理職二等', 20),
  ('P3', '專業職三等', 13);

insert into public.job (code, title, purpose, responsibilities, work_items, ksa_requirements, approval_status) values
  ('JOB-SPM', '策略績效管理師', '維護 OGSM 與 KPI 治理節奏', '["策略節點版本管理","KPI 週期追蹤","跨部門待辦彙整"]', '["OGSM送審","KPI檢核"]', '["策略拆解","資料分析","溝通協調"]', 'approved'),
  ('JOB-HRBP', 'HRBP', '協助組織能力與職務體系落地', '["職務說明書維護","任職歷程檢核","績效流程支援"]', '["人才盤點","職務維護"]', '["組織設計","人才盤點","制度溝通"]', 'submitted');

insert into public.employee (employee_code, display_name) values
  ('E-DEMO-001', '範例主管 A'),
  ('E-DEMO-002', '範例專員 B'),
  ('E-DEMO-003', '指定審核人 C');

insert into public.user_account (employee_id, email)
select e.id, lower(e.employee_code) || '@example.invalid'
from public.employee e;

insert into public.role (code, name) values
  ('ADMIN', 'Admin'),
  ('HR', 'HR'),
  ('MANAGER', 'Manager'),
  ('REVIEWER', 'Reviewer'),
  ('EMPLOYEE', 'Employee'),
  ('TASK_LEADER', 'Task Leader'),
  ('EXEC_VIEWER', 'Executive Viewer');

insert into public.permission (code, name, category) values
  ('dashboard:view', '檢視 Dashboard', 'function'),
  ('ogsm:review', '審核 OGSM', 'function'),
  ('worklog:confirm', '確認工作日誌', 'function'),
  ('audit:view', '檢視稽核紀錄', 'function'),
  ('scope:company', '公司級資料範圍', 'data');

insert into public.reporting_period (code, name, start_date, end_date) values
  ('2026-M06', '2026年6月', '2026-06-01', '2026-06-30');

insert into public.traffic_light_rule (code, name, rule_type, green_condition, yellow_condition, red_condition, gray_condition, blue_condition) values
  ('UPDATE_OVERDUE', '更新逾期', 'freshness', '準時更新', '接近逾期', '已逾期', '未啟用', '草稿或觀察期'),
  ('KPI_VARIANCE', 'KPI目標差異', 'variance', '達標', '輕微落後', '重大落後', '無目標', '新建KPI');

insert into public.notification_rule (code, name, trigger_type) values
  ('WORKLOG_DAILY', '每日工作日誌提醒', 'schedule'),
  ('APPROVAL_PENDING', '待審核提醒', 'event');
