import { Router } from "express";
import { ServiceFactory } from "./services";

export function registerRoutes(router: Router) {
  const jobRoleService = ServiceFactory.getJobRoleService();
  const employeeService = ServiceFactory.getEmployeeService();
  const siteService = ServiceFactory.getSiteService();
  const compensationService = ServiceFactory.getCompensationService(); // Added service for compensation

  // Initialize default data
  ServiceFactory.initializeDefaults().catch(console.error);

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

  // Employee routes
  router.get("/employees", async (req, res) => {
    try {
      const { page, limit, sort, filter } = req.query;
      const employees = await employeeService.findEmployees({
        page: Number(page),
        limit: Number(limit),
        sort: sort as string,
        filter: filter as string,
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