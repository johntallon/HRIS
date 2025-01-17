import { Router } from "express";
import { db } from "@db";
import { employees, compensation, sites, auditLogs, jobRoles } from "@db/schema";
import { eq, like, desc, sql } from "drizzle-orm";

export function registerRoutes(router: Router) {
  // Job Roles routes
  router.get("/job-roles", async (_req, res) => {
    try {
      const allRoles = await db.select().from(jobRoles);
      res.json(allRoles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching job roles" });
    }
  });

  router.post("/job-roles", async (req, res) => {
    try {
      const [role] = await db
        .insert(jobRoles)
        .values(req.body)
        .returning();

      await db.insert(auditLogs).values({
        userId: 1, // Default system user ID for now
        action: "CREATE",
        entityType: "JOB_ROLE",
        entityId: role.id,
        changes: JSON.stringify(req.body),
      });

      res.json(role);
    } catch (error) {
      res.status(500).json({ message: "Error creating job role" });
    }
  });

  // Employee routes
  router.get("/employees", async (req, res) => {
    try {
      const { page = 1, limit = 10, sort, filter } = req.query;

      let query = db.select({
        id: employees.id,
        name: employees.name,
        employeeId: employees.employeeId,
        jobRoleId: employees.jobRoleId,
        department: employees.department,
        siteId: employees.siteId,
        managerId: employees.managerId
      })
      .from(employees)
      .leftJoin(jobRoles, eq(employees.jobRoleId, jobRoles.id))
      .leftJoin(sites, eq(employees.siteId, sites.id));

      if (filter) {
        query = query.where(
          sql`${employees.name} LIKE ${`%${filter}%`}`
        );
      }

      if (sort) {
        const [field, order] = (sort as string).split(':');
        if (field && order) {
          const sortOrder = order === 'asc' ? sql`asc` : sql`desc`;
          query = query.orderBy(sql`${sql.identifier(field)} ${sortOrder}`);
        }
      }

      const offset = (Number(page) - 1) * Number(limit);
      const [countResult] = await db.select({ count: sql`count(*)` }).from(employees);

      const results = await query.limit(Number(limit)).offset(offset);

      res.json({
        data: results,
        total: countResult.count,
        page: Number(page),
        totalPages: Math.ceil(countResult.count / Number(limit))
      });
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ message: String(error) });
    }
  });

  router.get("/employees/:id", async (req, res) => {
    try {
      const [employee] = await db
        .select()
        .from(employees)
        .where(eq(employees.id, parseInt(req.params.id)));

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.json(employee);
    } catch (error) {
      console.error('Error fetching employee:', error);
      res.status(500).json({ message: String(error) });
    }
  });

  router.post("/employees", async (req, res) => {
    try {
      const [employee] = await db
        .insert(employees)
        .values(req.body)
        .returning();

      await db.insert(auditLogs).values({
        userId: 1, // Default system user ID for now
        action: "CREATE",
        entityType: "EMPLOYEE",
        entityId: employee.id,
        changes: JSON.stringify(req.body),
      });

      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Error creating employee" });
    }
  });

  router.put("/employees/:id", async (req, res) => {
    try {
      const [employee] = await db
        .update(employees)
        .set(req.body)
        .where(eq(employees.id, parseInt(req.params.id)))
        .returning();

      await db.insert(auditLogs).values({
        userId: 1,
        action: "UPDATE",
        entityType: "EMPLOYEE",
        entityId: employee.id,
        changes: JSON.stringify(req.body),
      });

      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Error updating employee" });
    }
  });

  // Site routes
  router.get("/sites", async (_req, res) => {
    try {
      const allSites = await db.select().from(sites);
      res.json(allSites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sites" });
    }
  });

  // Compensation routes
  router.get("/compensation/:employeeId", async (req, res) => {
    try {
      const employeeCompensation = await db
        .select()
        .from(compensation)
        .where(eq(compensation.employeeId, parseInt(req.params.employeeId)));
      res.json(employeeCompensation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching compensation" });
    }
  });

  router.post("/compensation", async (req, res) => {
    try {
      const [comp] = await db
        .insert(compensation)
        .values(req.body)
        .returning();

      await db.insert(auditLogs).values({
        userId: 1, // Default system user ID for now
        action: "CREATE",
        entityType: "COMPENSATION",
        entityId: comp.id,
        changes: JSON.stringify(req.body),
      });

      res.json(comp);
    } catch (error) {
      res.status(500).json({ message: "Error creating compensation record" });
    }
  });

  // Health check endpoint
  router.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return router;
}