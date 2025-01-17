import type { Router } from "express";
import { db } from "@db";
import { employees, compensation, sites, auditLogs } from "@db/schema";
import { eq } from "drizzle-orm";

const requireAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Unauthorized");
};

export function registerRoutes(router: Router) {
  // Healthcheck endpoint
  router.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Employee routes
  router.get("/employees", requireAuth, async (req, res) => {
    try {
      const allEmployees = await db.select().from(employees);
      res.json(allEmployees);
    } catch (error) {
      res.status(500).json({ message: "Error fetching employees" });
    }
  });

  router.post("/employees", requireAuth, async (req, res) => {
    try {
      const [employee] = await db.insert(employees).values(req.body).returning();

      await db.insert(auditLogs).values({
        userId: req.user!.id,
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
  router.get("/sites", requireAuth, async (_req, res) => {
    try {
      const allSites = await db.select().from(sites);
      res.json(allSites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sites" });
    }
  });

  router.post("/sites", requireAuth, async (req, res) => {
    try {
      const [site] = await db.insert(sites).values(req.body).returning();
      res.json(site);
    } catch (error) {
      res.status(500).json({ message: "Error creating site" });
    }
  });

  // Compensation routes
  router.get("/compensation/:employeeId", requireAuth, async (req, res) => {
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

  router.post("/compensation", requireAuth, async (req, res) => {
    try {
      const [comp] = await db.insert(compensation).values(req.body).returning();

      await db.insert(auditLogs).values({
        userId: req.user!.id,
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
}