import passport from "passport";
import { BearerStrategy } from "passport-azure-ad";
import session from "express-session";
import createMemoryStore from "memorystore";
import { users } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";
import { type Express } from "express";

const config = {
  identityMetadata: process.env.AZURE_AD_IDENTITY_METADATA,
  clientID: process.env.AZURE_AD_CLIENT_ID,
  validateIssuer: true,
  issuer: process.env.AZURE_AD_ISSUER,
  passReqToCallback: false,
  audience: process.env.AZURE_AD_CLIENT_ID,
};

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);

  app.use(session({
    secret: process.env.REPL_ID || "hr-system-secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86400000 }),
    cookie: app.get("env") === "production" ? { secure: true } : {}
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new BearerStrategy(config, async (token: any, done: any) => {
    try {
      // Check if user exists in our database
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.entraId, token.oid))
        .limit(1);

      if (!user) {
        // Create new user if doesn't exist
        const [newUser] = await db
          .insert(users)
          .values({
            username: token.preferred_username,
            entraId: token.oid,
            role: "Employee",
            password: "" // Not needed with Entra ID
          })
          .returning();
        return done(null, newUser);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  return passport;
}