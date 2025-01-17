import { BaseService } from "./base.service";
import { sites, type Site } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

export class SiteService extends BaseService<Site> {
  constructor() {
    super(sites);
  }

  async findByName(name: string) {
    const [site] = await db
      .select()
      .from(sites)
      .where(eq(sites.name, name))
      .limit(1);
    return site;
  }

  async initializeDefaultSites() {
    const defaultSites = [
      { name: "Poland" },
      { name: "Malaysia" },
      { name: "Florida" },
      { name: "Bristol" },
    ];

    for (const site of defaultSites) {
      const existing = await this.findByName(site.name);
      if (!existing) {
        await this.create(site);
      }
    }
  }
}
