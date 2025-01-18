import { Router } from "express";
import passport from "passport";
import { ServiceFactory } from "./services";
import { authenticateToken } from "./authMiddleware";
import { z } from "zod";

const employeeFilterSchema = z.object({
  search: z.string().optional(),
  department: z.string().optional(),
  jobRoleId: z.coerce.number().optional(),
  siteId: z.coerce.number().optional(),
  managerId: z.coerce.number().optional(),
});

const compensationSchema = z.object({
  employeeId: z.number(),
  title: z.string(),
  startDate: z.coerce.date(),
  amount: z.number(),
  notes: z.string().optional(),
});

export function registerRoutes(router: Router) {
  const employeeService = ServiceFactory.getEmployeeService();
  const compensationService = ServiceFactory.getCompensationService();
  const jobRoleService = ServiceFactory.getJobRoleService(); // Added JobRoleService
  const siteService = ServiceFactory.getSiteService(); // Added SiteService
  // Compensation routes
  router.get("/compensation/:employeeId", async (req, res) => {
    try {
      const compensation = await compensationService.findByEmployeeId(
        parseInt(req.params.employeeId),
      );
      res.json(compensation);
    } catch (error) {
      res.status(500).json({ message: String(error) });
    }
  });

  router.post("/compensation", async (req, res) => {
    try {
      const data = compensationSchema.parse(req.body);
      const compensation = await compensationService.create(data);
      res.json(compensation);
    } catch (error) {
      res.status(500).json({ message: String(error) });
    }
  });

  // Employee routes with advanced filtering and job role name
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

      // Fetch job role names and add them to the employee objects.
      const employeesWithJobRoleNames = await Promise.all(
        employees.data.map(async (employee) => {
          const jobRole = await jobRoleService.findById(employee.jobRoleId);
          return { ...employee, jobRoleName: jobRole ? jobRole.name : null };
        }),
      );

      // Fetch job role names and add them to the employee objects.
      const employeesWithSiteNames = await Promise.all(
        employees.data.map(async (employee) => {
          const site = await siteService.findById(employee.siteId);
          return { ...employee, siteName: site ? site.name : null };
        }),
      );

      res.json({
        ...employees,
        data: { ...employeesWithJobRoleNames, ...employeesWithSiteNames },
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
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
      const employee = await employeeService.update(
        parseInt(req.params.id),
        req.body,
      );
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Error updating employee" });
    }
  });

  // Job Roles endpoint
  router.get("/job-roles", async (req, res) => {
    try {
      const roles = await jobRoleService.findAll();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching job roles" });
    }
  });

  // Sites endpoint
  router.get("/sites", async (req, res) => {
    try {
      const sites = await siteService.findAll();
      res.json(sites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sites" });
    }
  });

  router.get(
    "/api/user",
    passport.authenticate("azure-ad-bearer-token", { session: false }),
    (req, res) => {
      res.json(req.user);
    },
  );

  router.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  router.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ message: "Protected data", user: req.user });
  });

  // Health check endpoint
  router.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return router;
}
