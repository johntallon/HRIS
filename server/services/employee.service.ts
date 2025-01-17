import { BaseService } from "./base.service";
import { employees, type Employee } from "@db/schema";
import { db } from "@db";
import { eq, and, ilike, desc, asc, sql } from "drizzle-orm";

type EmployeeQueryParams = {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
};

export class EmployeeService extends BaseService<Employee> {
  constructor() {
    super(employees);
  }

  async findEmployees({ page = 1, limit = 10, sort, filter }: EmployeeQueryParams) {
    let query = db.select().from(employees);

    // Apply filter
    if (filter) {
      query = query.where(
        sql`${employees.name} ILIKE ${`%${filter}%`} OR 
            ${employees.employeeId} ILIKE ${`%${filter}%`} OR 
            ${employees.department} ILIKE ${`%${filter}%`}`
      );
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
      .from(employees);
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