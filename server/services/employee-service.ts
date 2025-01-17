import { db } from "@db";

async createCompensation(data: any) {
  return db.insert(compensation).values(data);
}

async getEmployees(page = 1, limit = 10, sort?: string, filter?: string) {
    let query = db.select().from(employees);

    if (filter) {
      query = query.where(sql`${employees.name} ILIKE ${`%${filter}%`}`);
    }

    if (sort) {
      const [field, order] = sort.split(':');
      if (field === 'name' || field === 'employeeId' || field === 'department') {
        query = query.orderBy(employees[field], order === 'asc' ? 'asc' : 'desc');
      }
    }

    const offset = (page - 1) * limit;
    const results = await query.limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(employees);
    const total = Number(countResult[0]?.count || 0);

    return {
      data: results,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

