import { JobRoleService } from "./job-role.service";
import { EmployeeService } from "./employee.service";
import { SiteService } from "./site.service";
import { CompensationService } from "./compensation.service";

// Service factory to ensure singleton instances
export class ServiceFactory {
  private static jobRoleService: JobRoleService;
  private static employeeService: EmployeeService;
  private static siteService: SiteService;
  private static compensationService: CompensationService;

  static getJobRoleService() {
    if (!this.jobRoleService) {
      this.jobRoleService = new JobRoleService();
    }
    return this.jobRoleService;
  }

  static getEmployeeService() {
    if (!this.employeeService) {
      this.employeeService = new EmployeeService();
    }
    return this.employeeService;
  }

  static getSiteService() {
    if (!this.siteService) {
      this.siteService = new SiteService();
    }
    return this.siteService;
  }

  static getCompensationService() {
    if (!this.compensationService) {
      this.compensationService = new CompensationService();
    }
    return this.compensationService;
  }

  // Initialize default data
  static async initializeDefaults() {
    await this.getJobRoleService().initializeDefaultRoles();
    await this.getSiteService().initializeDefaultSites();
  }
}

export { ServiceFactory };