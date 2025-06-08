import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  primaryKey
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { generateInviteCode, generateInvokeId, generateOrganizationId } from "@/lib/utils";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").$defaultFn(() => false).notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updatedAt").$defaultFn(() => new Date()).notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updatedAt").$defaultFn(() => new Date()).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").$defaultFn(() => new Date()),
  updatedAt: timestamp("updatedAt").$defaultFn(() => new Date()),
});

export const plan = pgEnum("plan", ["free", "plus"]);

export const organization = pgTable("organization", {
  id: text("id").primaryKey().$defaultFn(generateOrganizationId),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  plan: plan("plan").default("free").notNull(),
  createdBy: text("createdBy").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updatedAt").$defaultFn(() => new Date()).notNull(),
});

export const role = pgEnum("role", ["admin", "member", "guest"]);

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey().$defaultFn(generateInvokeId),
  inviteCode: text("inviteCode").notNull().$defaultFn(generateInviteCode),
  role: role("role").notNull(),
  organizationId: text("organizationId").notNull().references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").$defaultFn(() => new Date()).notNull(),
});

export const member = pgTable("member", {
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  organizationId: text("organizationId").notNull().references(() => organization.id, { onDelete: "cascade" }),
  role: role("role").default("member").notNull(),
  createdAt: timestamp("createdAt").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updatedAt").$defaultFn(() => new Date()).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.organizationId] }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  memberships: many(member),
  createdOrganizations: many(organization),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const organizationRelations = relations(organization, ({ one, many }) => ({
  creator: one(user, {
    fields: [organization.createdBy],
    references: [user.id],
  }),
  members: many(member),
  invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
}));