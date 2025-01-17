import { Router } from "express";
import { db } from "@db";
import { employees, compensation, sites, auditLogs } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(router: Router) {
  // Employee routes
  router.get("/employees", async (_req, res) => {
    try {
      const allEmployees = await db.select().from(employees);
      res.json(allEmployees);
    } catch (error) {
      res.status(500).json({ message: "Error fetching employees" });
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