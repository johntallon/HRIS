
import { BaseService } from "./base.service";
import { users, type User } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

export class UserService extends BaseService<User> {
  constructor() {
    super(users);
  }

  async findByUsername(username: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    return user;
  }
}

export const userService = new UserService();
