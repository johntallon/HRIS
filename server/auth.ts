
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
    secret: process.env.SESSION_SECRET || "hr-system-secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86400000 }),
    cookie: { secure: process.env.NODE_ENV === "production" }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new BearerStrategy(config, async (token: any, done: any) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.entraId, profile.oid))
        .limit(1);

      if (!user) {
        const [newUser] = await db
          .insert(users)
          .values({
            username: profile.preferred_username || profile.upn,
            entraId: profile.oid,
            role: "Employee",
            password: ""
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
