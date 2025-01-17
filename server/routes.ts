import { Router } from "express";
import { ServiceFactory } from "./services";
import { z } from "zod";

const employeeFilterSchema = z.object({
  search: z.string().optional(),
  department: z.string().optional(),
  jobRoleId: z.coerce.number().optional(),
  siteId: z.coerce.number().optional(),
  managerId: z.coerce.number().optional(),
});

export function registerRoutes(router: Router) {
  const jobRoleService = ServiceFactory.getJobRoleService();
  const employeeService = ServiceFactory.getEmployeeService();
  const siteService = ServiceFactory.getSiteService();
  const compensationService = ServiceFactory.getCompensationService();

  // Initialize default data
  ServiceFactory.initializeDefaults().catch(console.error);

  // Employee routes with advanced filtering
  router.get("/employees", async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const sort = req.query.sort as string;

      // Parse and validate filters
      const filterResult = employeeFilterSchema.safeParse({
        search: req.query.search,
        department: req.query.department,
        jobRoleId: req.query.jobRoleId,
        siteId: req.query.siteId,
        managerId: req.query.managerId,
      });

      const filters = filterResult.success ? filterResult.data : undefined;

      const employees = await employeeService.findEmployees({
        page,
        limit,
        sort,
        filters,
      });

      res.json(employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ message: String(error) });
    }
  });

  router.get("/employees/:id", async (req, res) => {
    try {
      const employee = await employeeService.findById(parseInt(req.params.id));
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Error fetching employee" });
    }
  });

  router.post("/employees", async (req, res) => {
    try {
      const employee = await employeeService.createEmployee(req.body);
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: String(error) });
    }
  });

  router.put("/employees/:id", async (req, res) => {
    try {
      const employee = await employeeService.update(parseInt(req.params.id), req.body);
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Error updating employee" });
    }
  });

  // Site routes
  router.get("/sites", async (_req, res) => {
    try {
      const sites = await siteService.findAll();
      res.json(sites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sites" });
    }
  });

  // Job Roles routes
  router.get("/job-roles", async (_req, res) => {
    try {
      const roles = await jobRoleService.findAll();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching job roles" });
    }
  });

  router.post("/job-roles", async (req, res) => {
    try {
      const role = await jobRoleService.create(req.body);
      res.json(role);
    } catch (error) {
      res.status(500).json({ message: "Error creating job role" });
    }
  });

  // Compensation routes
  router.get("/compensation/:employeeId", async (req, res) => {
    try {
      const compensation = await compensationService.findByEmployeeId(parseInt(req.params.employeeId));
      res.json(compensation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching compensation" });
    }
  });

  router.post("/compensation", async (req, res) => {
    try {
      const compensation = await compensationService.create(req.body);
      res.json(compensation);
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