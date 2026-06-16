import { DataService } from "./data-service.js";
import { mockData } from "../mock-data.js";

export class MockDataService extends DataService {
  async getCurrentUser() {
    return mockData.currentUser;
  }

  async getHomeSummary() {
    return mockData.homeSummary;
  }

  async getOrganizations() {
    return mockData.organizations;
  }

  async getTaskOrganizations() {
    return mockData.taskOrganizations;
  }

  async getOgsm() {
    return mockData.ogsm;
  }

  async getKpis() {
    return mockData.kpis;
  }

  async getDashboard() {
    return mockData.dashboard;
  }

  async getJobDescriptions() {
    return mockData.jobDescriptions;
  }

  async getWorkLogs() {
    return mockData.workLogs;
  }

  async getApprovals() {
    return mockData.approvals;
  }

  async getAuditLogs() {
    return mockData.auditLogs;
  }
}
