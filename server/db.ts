import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  proposals,
  InsertProposal,
  proposalViews,
  InsertProposalView,
  engagementEvents,
  userBranding,
  InsertUserBranding,
  InsertEngagementEvent,
  signatures,
  InsertSignature,
  templates,
  InsertTemplate,
  Template
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== User Management =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== Proposal Management =====

export async function createProposal(proposal: InsertProposal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(proposals).values(proposal);
  return result[0].insertId;
}

export async function getUserProposals(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(proposals)
    .where(eq(proposals.userId, userId))
    .orderBy(desc(proposals.createdAt));
}

export async function getProposalById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, id))
    .limit(1);

  return result[0];
}

export async function updateProposal(id: number, data: Partial<InsertProposal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(proposals)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(proposals.id, id));
}

export async function deleteProposal(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(proposals).where(eq(proposals.id, id));
}

// ===== Proposal Views =====

export async function createOrUpdateProposalView(view: InsertProposalView) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if session already exists
  const existing = await db
    .select()
    .from(proposalViews)
    .where(
      and(
        eq(proposalViews.proposalId, view.proposalId),
        eq(proposalViews.sessionId, view.sessionId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update last viewed time
    await db
      .update(proposalViews)
      .set({ lastViewedAt: new Date() })
      .where(eq(proposalViews.id, existing[0].id));
    return existing[0].id;
  } else {
    // Create new view
    const result = await db.insert(proposalViews).values(view);
    return result[0].insertId;
  }
}

export async function getProposalViews(proposalId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(proposalViews)
    .where(eq(proposalViews.proposalId, proposalId))
    .orderBy(desc(proposalViews.firstViewedAt));
}

// ===== Engagement Events =====

export async function createEngagementEvent(event: InsertEngagementEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(engagementEvents).values(event);
  return result[0].insertId;
}

export async function getProposalEngagementEvents(proposalId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(engagementEvents)
    .where(eq(engagementEvents.proposalId, proposalId))
    .orderBy(desc(engagementEvents.createdAt));
}

export async function getSessionEngagementEvents(sessionId: string) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(engagementEvents)
    .where(eq(engagementEvents.sessionId, sessionId))
    .orderBy(engagementEvents.createdAt);
}

// ===== Signatures =====

export async function createSignature(signature: InsertSignature) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(signatures).values(signature);
  
  // Update proposal status to signed
  await db
    .update(proposals)
    .set({ status: "published" })
    .where(eq(proposals.id, signature.proposalId));

  return result[0].insertId;
}

export async function getSignatureByProposalId(proposalId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(signatures)
    .where(eq(signatures.proposalId, proposalId))
    .limit(1);

  return result[0];
}

// ===== Analytics =====

export async function getProposalAnalytics(proposalId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get view count and unique sessions
  const viewStats = await db
    .select({
      totalViews: sql<number>`COUNT(*)`,
      uniqueSessions: sql<number>`COUNT(DISTINCT ${proposalViews.sessionId})`,
    })
    .from(proposalViews)
    .where(eq(proposalViews.proposalId, proposalId));

  // Get event counts by type
  const eventStats = await db
    .select({
      eventType: engagementEvents.eventType,
      count: sql<number>`COUNT(*)`,
    })
    .from(engagementEvents)
    .where(eq(engagementEvents.proposalId, proposalId))
    .groupBy(engagementEvents.eventType);

  return {
    views: viewStats[0] || { totalViews: 0, uniqueSessions: 0 },
    events: eventStats,
  };
}


// ===== Templates =====

export async function getAllTemplates() {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(templates)
    .where(eq(templates.isPublic, true))
    .orderBy(desc(templates.createdAt));

  return result;
}

export async function getTemplateById(id: number): Promise<Template | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(templates)
    .where(eq(templates.id, id))
    .limit(1);

  return result[0];
}

export async function createTemplate(template: InsertTemplate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(templates).values(template);
  return result[0].insertId;
}



export async function duplicateProposal(proposalId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get original proposal
  const original = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, proposalId))
    .limit(1);

  if (original.length === 0) {
    throw new Error("Proposal not found");
  }

  const prop = original[0];

  // Create duplicate with " (Copy)" suffix
  const result = await db.insert(proposals).values({
    userId,
    title: prop.title,
    clientName: prop.clientName,
    projectName: `${prop.projectName} (Copy)`,
    validUntil: prop.validUntil,
    status: "draft", // Always create as draft
    problems: prop.problems,
    solutionPhases: prop.solutionPhases,
    deliverables: prop.deliverables,
    caseStudies: prop.caseStudies,
    pricingTiers: prop.pricingTiers,
    addOns: prop.addOns,
  });

  return result[0].insertId;
}



// ==================== User Branding ====================

export async function getUserBranding(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(userBranding)
    .where(eq(userBranding.userId, userId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function upsertUserBranding(data: InsertUserBranding) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getUserBranding(data.userId);
  
  if (existing) {
    await db
      .update(userBranding)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(userBranding.userId, data.userId));
    
    return getUserBranding(data.userId);
  } else {
    await db.insert(userBranding).values(data);
    return getUserBranding(data.userId);
  }
}

