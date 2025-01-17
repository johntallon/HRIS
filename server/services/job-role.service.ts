import { BaseService } from "./base.service";
import { jobRoles, type JobRole } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

export class JobRoleService extends BaseService<JobRole> {
  constructor() {
    super(jobRoles);
  }

  async findByName(name: string) {
    const [role] = await db
      .select()
      .from(jobRoles)
      .where(eq(jobRoles.name, name))
      .limit(1);
    return role;
  }

  async initializeDefaultRoles() {
    const defaultRoles = [
      { name: "CEO", description: "Chief Executive Officer" },
      { name: "CFO", description: "Chief Financial Officer" },
      { name: "HR Director", description: "Human Resources Director" },
      { name: "Site Lead", description: "Site/Location Manager" },
      { name: "Finance Lead", description: "Financial Operations Lead" },
      { name: "Line Manager", description: "Department Line Manager" },
      { name: "Employee", description: "Standard Employee" },
    ];

    for (const role of defaultRoles) {
      const existing = await this.findByName(role.name);
      if (!existing) {
        await this.create(role);
      }
    }
  }
}
