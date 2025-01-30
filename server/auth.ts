import passport from "passport";
import { OIDCStrategy } from "passport-azure-ad";
import session from "express-session";
import createMemoryStore from "memorystore";
import { users } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";
import { type Express } from "express";

const config = {
  identityMetadata: `https://login.microsoftonline.com/90f9f222-ca81-4252-ab4a-a9974c8557b2/v2.0/.well-known/openid-configuration`,
  clientID: "1b1ffb5b-8849-45d7-98c0-630b7d83c647",
  clientSecret:
    process.env.AZURE_CLIENT_SECRET || "RGf8QJrxeSJualJdmG7v2LN3~PuOLIujbt1dmC",
  responseType: "code id_token",
  responseMode: "form_post",
  redirectUrl:
    process.env.REDIRECT_URI ||
    "https://4918b87e-126a-48c9-8d43-89a97e602173-00-1tdtxri805v4.worf.replit.dev/api/auth/callback",
  allowHttpForRedirectUrl: true, // Only for development
  validateIssuer: true,
  issuer: `https://login.microsoftonline.com/90f9f222-ca81-4252-ab4a-a9974c8557b2/v2.0`,
  passReqToCallback: false,
  scope: ["profile", "email", "openid"],
};

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "hr-system-secret",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({ checkPeriod: 86400000 }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Add login route
  app.get(
    "/api/auth/login",
    passport.authenticate("azuread-openidconnect", {
      failureRedirect: "/login",
      successRedirect: "/",
    }),
  );

  // Add callback route
  app.post(
    "/api/auth/callback",
    passport.authenticate("azuread-openidconnect", {
      failureRedirect: "/login",
      successRedirect: "/",
    }),
  );

  passport.use(
    "azuread-openidconnect",
    new OIDCStrategy(config, async (profile: any, done: any) => {
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
              password: "",
            })
            .returning();
          return done(null, newUser);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

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
