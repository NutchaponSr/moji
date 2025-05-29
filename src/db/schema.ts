import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { 
  generateInviteCode, 
  generateOrganizationId 
} from "@/lib/utils";

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

export const organization = pgTable("organization", {
  id: text("id").primaryKey().$defaultFn(generateOrganizationId),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  inviteCode: text("inviteCode").notNull().$defaultFn(generateInviteCode),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updatedAt").$defaultFn(() => new Date()).notNull(),
});

export const role = pgEnum("role", ["admin", "member"]);

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  role: role("role").default("member").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  organizationId: text("organizationId").notNull().references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updatedAt").$defaultFn(() => new Date()).notNull(),
});