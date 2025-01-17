import { BaseService } from "./base.service";
import { employees, type Employee } from "@db/schema";
import { db } from "@db";
import { eq, and, or, ilike, desc, asc, sql, type SQL } from "drizzle-orm";

type FilterCriteria = {
  search?: string;
  department?: string;
  jobRoleId?: number;
  siteId?: number;
  managerId?: number;
};

type EmployeeQueryParams = {
  page?: number;
  limit?: number;
  sort?: string;
  filters?: FilterCriteria;
};

export class EmployeeService extends BaseService<Employee> {
  constructor() {
    super(employees);
  }

  async findEmployees({ page = 1, limit = 10, sort, filters }: EmployeeQueryParams) {
    let query = db.select().from(employees);
    const conditions: SQL[] = [];

    // Apply filters
    if (filters) {
      if (filters.search) {
        conditions.push(
          or(
            ilike(employees.name, `%${filters.search}%`),
            ilike(employees.employeeId, `%${filters.search}%`),
            ilike(employees.department, `%${filters.search}%`)
          )
        );
      }

      if (filters.department) {
        conditions.push(ilike(employees.department, `%${filters.department}%`));
      }

      if (filters.jobRoleId) {
        conditions.push(eq(employees.jobRoleId, filters.jobRoleId));
      }

      if (filters.siteId) {
        conditions.push(eq(employees.siteId, filters.siteId));
      }

      if (filters.managerId) {
        conditions.push(eq(employees.managerId, filters.managerId));
      }
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    if (sort) {
      const [field, order] = sort.split(':');
      if (field === 'name') {
        query = query.orderBy(order === 'asc' ? asc(employees.name) : desc(employees.name));
      } else if (field === 'employeeId') {
        query = query.orderBy(order === 'asc' ? asc(employees.employeeId) : desc(employees.employeeId));
      } else if (field === 'department') {
        query = query.orderBy(order === 'asc' ? asc(employees.department) : desc(employees.department));
      }
    }

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)::integer` })
      .from(employees)
      .where(and(...conditions));

    const total = Number(countResult[0]?.count || 0);

    // Apply pagination
    const offset = (Number(page) - 1) * Number(limit);
    const results = await query.limit(Number(limit)).offset(offset);

    return {
      data: results,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    };
  }

  async findByManagerId(managerId: number) {
    return db
      .select()
      .from(employees)
      .where(eq(employees.managerId, managerId));
  }

  async findBySiteId(siteId: number) {
    return db
      .select()
      .from(employees)
      .where(eq(employees.siteId, siteId));
  }

  async isValidManager(managerId: number) {
    const [manager] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, managerId))
      .limit(1);

    return Boolean(manager);
  }

  async createEmployee(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) {
    if (data.managerId && !(await this.isValidManager(data.managerId))) {
      throw new Error('Invalid manager ID');
    }

    return this.create(data);
  }
}