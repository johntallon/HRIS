
import { BaseService } from "./base.service";
import { compensation, type Compensation } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

export class CompensationService extends BaseService<Compensation> {
  constructor() {
    super(compensation);
  }

  async create(data: Omit<Compensation, "id">) {
    return db.insert(compensation).values(data);
  }

  async findByEmployeeId(employeeId: number) {
    return db
      .select()
      .from(compensation)
      .where(eq(compensation.employeeId, employeeId))
      .orderBy(compensation.startDate);
  }
}
