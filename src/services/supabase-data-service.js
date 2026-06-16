import { DataService } from "./data-service.js";
import { createSupabaseClient } from "./supabase-client.js";

export class SupabaseDataService extends DataService {
  constructor(config) {
    super();
    this.config = config;
    this.clientPromise = createSupabaseClient(config);
  }

  async table(name) {
    const client = await this.clientPromise;
    if (!client) {
      throw new Error("Supabase client is not configured");
    }
    const { data, error } = await client.from(name).select("*");
    if (error) {
      throw error;
    }
    return data;
  }

  async getCurrentUser() {
    const client = await this.clientPromise;
    const { data: authData } = await client.auth.getUser();
    const userId = authData?.user?.id;
    const { data, error } = await client
      .from("user_account")
      .select("*, user_role(role(*))")
      .eq("auth_user_id", userId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  async getHomeSummary() {
    const [tasks, logs, approvals] = await Promise.all([
      this.table("work_task"),
      this.table("work_log"),
      this.table("approval_request")
    ]);
    return { tasks, logs, approvals };
  }

  async getOrganizations() {
    const [departments, employees, assignments] = await Promise.all([
      this.table("department"),
      this.table("employee"),
      this.table("employee_assignment")
    ]);
    return { departments, employees, assignments };
  }

  async getOgsm() {
    const [nodes, relations, versions] = await Promise.all([
      this.table("ogsm_node"),
      this.table("ogsm_relation"),
      this.table("ogsm_version")
    ]);
    return { nodes, relations, versions };
  }

  async getKpis() {
    const [definitions, targets, actuals, checkins] = await Promise.all([
      this.table("kpi_definition"),
      this.table("kpi_target"),
      this.table("kpi_actual"),
      this.table("progress_checkin")
    ]);
    return { definitions, targets, actuals, checkins };
  }

  async getDashboard() {
    const [lights, risks, actions] = await Promise.all([
      this.table("traffic_light_rule"),
      this.table("risk_issue"),
      this.table("action_item")
    ]);
    return { lights, risks, actions };
  }

  async getJobDescriptions() {
    return this.table("job");
  }

  async getWorkLogs() {
    return this.table("work_log");
  }

  async getWorkLogPresets() {
    return [];
  }

  async getApprovals() {
    return this.table("approval_request");
  }
}
