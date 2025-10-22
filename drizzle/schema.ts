import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User branding table - stores custom branding preferences
 */
export const userBranding = mysqlTable("userBranding", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  logoUrl: varchar("logoUrl", { length: 500 }),
  primaryColor: varchar("primaryColor", { length: 7 }).default("#644a40").notNull(),
  secondaryColor: varchar("secondaryColor", { length: 7 }).default("#ffdfb5").notNull(),
  accentColor: varchar("accentColor", { length: 7 }).default("#ffffff").notNull(),
  fontFamily: varchar("fontFamily", { length: 100 }).default("Inter").notNull(),
  companyName: varchar("companyName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserBranding = typeof userBranding.$inferSelect;
export type InsertUserBranding = typeof userBranding.$inferInsert;

/**
 * Templates table - stores proposal templates
 */
export const templates = mysqlTable("templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  industry: mysqlEnum("industry", ["web-design", "consulting", "saas", "marketing", "mobile-app", "ecommerce"]).notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdBy: int("createdBy"), // null for system templates
  
  // Template content (same structure as proposals)
  problems: json("problems").$type<Array<{ title: string; description: string; icon: string }>>().notNull(),
  solutionPhases: json("solutionPhases").$type<Array<{ title: string; duration: string }>>().notNull(),
  deliverables: json("deliverables").$type<Array<string>>().notNull(),
  caseStudies: json("caseStudies").$type<Array<{ title: string; description: string; metrics: Array<{ label: string; value: string }> }>>().notNull(),
  pricingTiers: json("pricingTiers").$type<Array<{ 
    name: string; 
    price: number; 
    features: Array<string>;
    recommended?: boolean;
  }>>().notNull(),
  addOns: json("addOns").$type<Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }>>().notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

/**
 * Proposals table - stores proposal metadata and content
 */
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Creator of the proposal
  
  // Basic info
  title: varchar("title", { length: 255 }).notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  projectName: varchar("projectName", { length: 255 }).notNull(),
  validUntil: timestamp("validUntil").notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("published").notNull(),
  lastEditedAt: timestamp("lastEditedAt").defaultNow().notNull(),
  
  // Content sections (stored as JSON)
  problems: json("problems").$type<Array<{ title: string; description: string; icon: string }>>().notNull(),
  solutionPhases: json("solutionPhases").$type<Array<{ title: string; duration: string }>>().notNull(),
  deliverables: json("deliverables").$type<Array<string>>().notNull(),
  caseStudies: json("caseStudies").$type<Array<{ title: string; description: string; metrics: Array<{ label: string; value: string }> }>>().notNull(),
  
  // Pricing tiers
  pricingTiers: json("pricingTiers").$type<Array<{ 
    name: string; 
    price: number; 
    features: Array<string>;
    recommended?: boolean;
  }>>().notNull(),
  
  // Add-ons
  addOns: json("addOns").$type<Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }>>().notNull(),
  

  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  sentAt: timestamp("sentAt"),
});

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;

/**
 * Proposal views - tracks when and how proposals are viewed
 */
export const proposalViews = mysqlTable("proposalViews", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: int("proposalId").notNull(),
  
  // Viewer info (optional - may be anonymous)
  viewerEmail: varchar("viewerEmail", { length: 320 }),
  viewerIp: varchar("viewerIp", { length: 45 }),
  
  // Session tracking
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  
  // Timestamps
  firstViewedAt: timestamp("firstViewedAt").defaultNow().notNull(),
  lastViewedAt: timestamp("lastViewedAt").defaultNow().notNull(),
});

export type ProposalView = typeof proposalViews.$inferSelect;
export type InsertProposalView = typeof proposalViews.$inferInsert;

/**
 * Engagement events - tracks user interactions with proposals
 */
export const engagementEvents = mysqlTable("engagementEvents", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: int("proposalId").notNull(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  
  // Event details
  eventType: mysqlEnum("eventType", [
    "section_viewed",
    "pricing_changed",
    "addon_toggled",
    "signature_started",
    "form_filled"
  ]).notNull(),
  
  eventData: json("eventData").$type<Record<string, any>>(),
  
  // Timestamp
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EngagementEvent = typeof engagementEvents.$inferSelect;
export type InsertEngagementEvent = typeof engagementEvents.$inferInsert;

/**
 * Signatures - stores signed proposals
 */
export const signatures = mysqlTable("signatures", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: int("proposalId").notNull().unique(), // One signature per proposal
  
  // Signer info
  signerName: varchar("signerName", { length: 255 }).notNull(),
  signerEmail: varchar("signerEmail", { length: 320 }).notNull(),
  
  // Signature data (base64 encoded image)
  signatureData: text("signatureData").notNull(),
  
  // Selected pricing
  selectedTier: varchar("selectedTier", { length: 100 }).notNull(),
  selectedAddOns: json("selectedAddOns").$type<Array<string>>().notNull(),
  totalPrice: int("totalPrice").notNull(), // Store in cents
  
  // IP for legal purposes
  ipAddress: varchar("ipAddress", { length: 45 }),
  
  // Timestamp
  signedAt: timestamp("signedAt").defaultNow().notNull(),
});

export type Signature = typeof signatures.$inferSelect;
export type InsertSignature = typeof signatures.$inferInsert;

