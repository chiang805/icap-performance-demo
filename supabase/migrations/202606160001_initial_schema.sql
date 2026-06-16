create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.department (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.department(id),
  code text not null unique,
  name text not null,
  core_mission text,
  status text not null default 'active' check (status in ('draft','active','inactive','void','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.position (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_grade (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  rank_order integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  purpose text,
  responsibilities jsonb not null default '[]',
  work_items jsonb not null default '[]',
  ksa_requirements jsonb not null default '[]',
  approval_status text not null default 'draft',
  version_no integer not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employee (
  id uuid primary key default gen_random_uuid(),
  employee_code text not null unique,
  display_name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_account (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  employee_id uuid references public.employee(id),
  email text not null unique,
  account_status text not null default 'active',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employee_assignment (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employee(id),
  department_id uuid not null references public.department(id),
  position_id uuid references public.position(id),
  job_id uuid references public.job(id),
  job_grade_id uuid references public.job_grade(id),
  manager_employee_id uuid references public.employee(id),
  start_date date not null,
  end_date date,
  allocation_percent numeric(5,2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.department_work_item (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.department(id),
  name text not null,
  description text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.role (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.permission (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  category text not null default 'function',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_role (
  id uuid primary key default gen_random_uuid(),
  user_account_id uuid not null references public.user_account(id),
  role_id uuid not null references public.role(id),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_account_id, role_id)
);

create table public.role_permission (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.role(id),
  permission_id uuid not null references public.permission(id),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (role_id, permission_id)
);

create table public.data_scope_rule (
  id uuid primary key default gen_random_uuid(),
  role_id uuid references public.role(id),
  user_account_id uuid references public.user_account(id),
  scope_type text not null,
  scope_value text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviewer_assignment (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employee(id),
  reviewer_employee_id uuid not null references public.employee(id),
  review_type text not null default 'default',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_organization (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('project','improvement','committee','cross_department_task')),
  name text not null,
  lead_employee_id uuid references public.employee(id),
  description text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_organization_member (
  id uuid primary key default gen_random_uuid(),
  task_organization_id uuid not null references public.task_organization(id),
  employee_id uuid not null references public.employee(id),
  role_name text not null default 'member',
  allocation_percent numeric(5,2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (task_organization_id, employee_id)
);

create table public.ogsm_node (
  id uuid primary key default gen_random_uuid(),
  node_code text not null unique,
  node_type text not null check (node_type in ('O','G','S','M')),
  title text not null,
  description text,
  parent_id uuid references public.ogsm_node(id),
  owner_employee_id uuid references public.employee(id),
  task_organization_id uuid references public.task_organization(id),
  review_status text not null default 'draft',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ogsm_relation (
  id uuid primary key default gen_random_uuid(),
  from_node_id uuid not null references public.ogsm_node(id),
  to_node_id uuid not null references public.ogsm_node(id),
  relation_type text not null check (relation_type in ('support','collaborate','shared_accountability','dependency')),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ogsm_collaborator (
  id uuid primary key default gen_random_uuid(),
  ogsm_node_id uuid not null references public.ogsm_node(id),
  employee_id uuid not null references public.employee(id),
  collaborator_role text not null default 'collaborator',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ogsm_node_id, employee_id)
);

create table public.ogsm_version (
  id uuid primary key default gen_random_uuid(),
  ogsm_node_id uuid not null references public.ogsm_node(id),
  version_no integer not null,
  snapshot jsonb not null,
  lifecycle_status text not null default 'draft',
  submitted_by uuid references public.user_account(id),
  approved_by uuid references public.user_account(id),
  approved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kpi_definition (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  measure_name text not null,
  direction text not null check (direction in ('higher_better','lower_better','range')),
  unit text,
  update_cycle text not null default 'monthly',
  owner_employee_id uuid references public.employee(id),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reporting_period (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kpi_target (
  id uuid primary key default gen_random_uuid(),
  kpi_definition_id uuid not null references public.kpi_definition(id),
  reporting_period_id uuid not null references public.reporting_period(id),
  target_value numeric,
  target_min numeric,
  target_max numeric,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kpi_actual (
  id uuid primary key default gen_random_uuid(),
  kpi_definition_id uuid not null references public.kpi_definition(id),
  reporting_period_id uuid not null references public.reporting_period(id),
  actual_value numeric,
  source_work_log_id uuid,
  confirmed_by uuid references public.user_account(id),
  confirmed_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ogsm_kpi_link (
  id uuid primary key default gen_random_uuid(),
  ogsm_node_id uuid not null references public.ogsm_node(id),
  kpi_definition_id uuid not null references public.kpi_definition(id),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ogsm_node_id, kpi_definition_id)
);

create table public.progress_checkin (
  id uuid primary key default gen_random_uuid(),
  ogsm_node_id uuid references public.ogsm_node(id),
  kpi_definition_id uuid references public.kpi_definition(id),
  employee_id uuid references public.employee(id),
  checkin_date date not null,
  progress_percent numeric(5,2),
  comment text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.milestone (
  id uuid primary key default gen_random_uuid(),
  ogsm_node_id uuid references public.ogsm_node(id),
  task_organization_id uuid references public.task_organization(id),
  title text not null,
  due_date date not null,
  completed_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.risk_issue (
  id uuid primary key default gen_random_uuid(),
  ogsm_node_id uuid references public.ogsm_node(id),
  kpi_definition_id uuid references public.kpi_definition(id),
  title text not null,
  severity text not null default 'medium',
  mitigation text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.action_item (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner_employee_id uuid references public.employee(id),
  ogsm_node_id uuid references public.ogsm_node(id),
  due_date date,
  decision_required boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_task (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  owner_employee_id uuid references public.employee(id),
  department_work_item_id uuid references public.department_work_item(id),
  ogsm_node_id uuid references public.ogsm_node(id),
  kpi_definition_id uuid references public.kpi_definition(id),
  task_organization_id uuid references public.task_organization(id),
  due_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_log (
  id uuid primary key default gen_random_uuid(),
  work_date date not null,
  employee_id uuid not null references public.employee(id),
  work_task_id uuid references public.work_task(id),
  department_work_item_id uuid references public.department_work_item(id),
  ogsm_node_id uuid references public.ogsm_node(id),
  kpi_definition_id uuid references public.kpi_definition(id),
  task_organization_id uuid references public.task_organization(id),
  content text not null,
  result text,
  hours numeric(5,2) not null default 0,
  progress_percent numeric(5,2),
  issue text,
  support_needed text,
  next_step text,
  review_status text not null default 'draft',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.kpi_actual
  add constraint kpi_actual_source_work_log_fk foreign key (source_work_log_id) references public.work_log(id);

create table public.work_log_review (
  id uuid primary key default gen_random_uuid(),
  work_log_id uuid not null references public.work_log(id),
  reviewer_employee_id uuid not null references public.employee(id),
  review_action text not null check (review_action in ('submit','return','approve','confirm')),
  comment text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.approval_request (
  id uuid primary key default gen_random_uuid(),
  request_type text not null,
  target_table text not null,
  target_id uuid not null,
  requester_user_id uuid references public.user_account(id),
  current_reviewer_employee_id uuid references public.employee(id),
  request_status text not null default 'submitted',
  reason text,
  before_snapshot jsonb,
  after_snapshot jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.approval_record (
  id uuid primary key default gen_random_uuid(),
  approval_request_id uuid not null references public.approval_request(id),
  actor_user_id uuid references public.user_account(id),
  action text not null check (action in ('submit','return','approve','void')),
  comment text,
  before_snapshot jsonb,
  after_snapshot jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notification (
  id uuid primary key default gen_random_uuid(),
  user_account_id uuid references public.user_account(id),
  title text not null,
  body text,
  read_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notification_rule (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  trigger_type text not null,
  channel text not null default 'in_app',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.traffic_light_rule (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  rule_type text not null,
  green_condition text,
  yellow_condition text,
  red_condition text,
  gray_condition text,
  blue_condition text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.user_account(id),
  action text not null,
  target_table text not null,
  target_id uuid,
  before_snapshot jsonb,
  after_snapshot jsonb,
  reason text,
  ip_address inet,
  user_agent text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_user_account_auth_user_id on public.user_account(auth_user_id);
create index idx_employee_assignment_employee on public.employee_assignment(employee_id);
create index idx_employee_assignment_department on public.employee_assignment(department_id);
create index idx_ogsm_node_parent on public.ogsm_node(parent_id);
create index idx_ogsm_relation_from_to on public.ogsm_relation(from_node_id, to_node_id);
create index idx_kpi_target_period on public.kpi_target(kpi_definition_id, reporting_period_id);
create index idx_kpi_actual_period on public.kpi_actual(kpi_definition_id, reporting_period_id);
create index idx_work_log_employee_date on public.work_log(employee_id, work_date);
create index idx_approval_request_status on public.approval_request(request_status);
create index idx_audit_log_target on public.audit_log(target_table, target_id);

do $$
declare
  t text;
begin
  foreach t in array array[
    'department','position','job_grade','job','employee','user_account','employee_assignment',
    'department_work_item','role','permission','user_role','role_permission','data_scope_rule',
    'reviewer_assignment','task_organization','task_organization_member','ogsm_node',
    'ogsm_relation','ogsm_collaborator','ogsm_version','kpi_definition','reporting_period',
    'kpi_target','kpi_actual','ogsm_kpi_link','progress_checkin','milestone','risk_issue',
    'action_item','work_task','work_log','work_log_review','approval_request','approval_record',
    'notification','notification_rule','traffic_light_rule','audit_log'
  ]
  loop
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

create or replace function public.current_user_account_id()
returns uuid language sql stable as $$
  select id from public.user_account where auth_user_id = auth.uid() and status = 'active' limit 1
$$;

create policy "authenticated users can read active reference data"
on public.department for select to authenticated using (status = 'active');
create policy "authenticated users can read employees"
on public.employee for select to authenticated using (status in ('active','inactive','archived'));
create policy "users can read own account"
on public.user_account for select to authenticated using (auth_user_id = auth.uid());
create policy "authenticated users can read active ogsm"
on public.ogsm_node for select to authenticated using (status = 'active');
create policy "authenticated users can read active kpi"
on public.kpi_definition for select to authenticated using (status = 'active');
create policy "users can manage own draft work logs"
on public.work_log for all to authenticated
using (employee_id in (select employee_id from public.user_account where auth_user_id = auth.uid()))
with check (employee_id in (select employee_id from public.user_account where auth_user_id = auth.uid()));
create policy "users can read own notifications"
on public.notification for select to authenticated using (user_account_id = public.current_user_account_id());
create policy "authenticated users can insert audit logs"
on public.audit_log for insert to authenticated with check (actor_user_id = public.current_user_account_id());

create policy "service readable roles"
on public.role for select to authenticated using (status = 'active');
create policy "service readable permissions"
on public.permission for select to authenticated using (status = 'active');
create policy "service readable user roles"
on public.user_role for select to authenticated using (status = 'active');
create policy "service readable role permissions"
on public.role_permission for select to authenticated using (status = 'active');
create policy "service readable data scopes"
on public.data_scope_rule for select to authenticated using (status = 'active');
