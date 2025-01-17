import { db } from "@db";
import { eq } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

export class BaseService<T extends { id: number; createdAt?: Date | null; updatedAt?: Date | null }> {
  constructor(protected table: PgTable) {}

  async findAll() {
    return db.select().from(this.table);
  }

  async findById(id: number) {
    const [record] = await db
      .select()
      .from(this.table)
      .where(eq(this.table.id as any, id))
      .limit(1);
    return record;
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    const [record] = await db
      .insert(this.table)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      } as any)
      .returning();
    return record;
  }

  async update(id: number, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>) {
    const [record] = await db
      .update(this.table)
      .set({
        ...data,
        updatedAt: new Date(),
      } as any)
      .where(eq(this.table.id as any, id))
      .returning();
    return record;
  }
}