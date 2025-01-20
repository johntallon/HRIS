import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Job Roles table
export const jobRoles = pgTable("job_roles", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User management tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password"),
  entraId: text("entra_id").unique(),
  employeeId: integer("employee_id").references(() => employees.id),
  role: text("role").notNull().default("Employee"),
  permissions: text("permissions").notNull().default("Personal Only"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sites = pgTable("sites", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const employees = pgTable("employees", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  employeeId: text("employee_id").unique().notNull().$defaultFn(() => crypto.randomUUID()),
  jobRoleId: integer("job_role").references(() => jobRoles.id),
  siteId: integer("site_id").references(() => sites.id),
  department: text("department").notNull(),
  isUser: boolean("is_user").default(true),
  managerId: integer("manager_id").references(() => employees.id),
  avatar: text("avatar").default('/Images/avatar.png'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const compensation = pgTable("compensation", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  employeeId: text("employee_id").references(() => employees.id),
  title: text("title").notNull(),
  startDate: timestamp("start_date").notNull(),
  amount: integer("amount").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  changes: text("changes").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Schema validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertEmployeeSchema = createInsertSchema(employees);
export const selectEmployeeSchema = createSelectSchema(employees);

export const insertCompensationSchema = createInsertSchema(compensation);
export const selectCompensationSchema = createSelectSchema(compensation);

export const insertJobRoleSchema = createInsertSchema(jobRoles);
export const selectJobRoleSchema = createSelectSchema(jobRoles);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;

export type Compensation = typeof compensation.$inferSelect;
export type NewCompensation = typeof compensation.$inferInsert;

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;

export type JobRole = typeof jobRoles.$inferSelect;
export type NewJobRole = typeof jobRoles.$inferInsert;