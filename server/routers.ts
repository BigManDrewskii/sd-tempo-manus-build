import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  proposals: router({
    // List user's proposals
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserProposals(ctx.user.id);
    }),

    // Get single proposal by ID
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getProposalById(input.id);
      }),

    // Create new proposal
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        clientName: z.string(),
        projectName: z.string(),
        validUntil: z.date(),
        problems: z.array(z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(),
        })),
        solutionPhases: z.array(z.object({
          title: z.string(),
          duration: z.string(),
        })),
        deliverables: z.array(z.string()),
        caseStudies: z.array(z.object({
          title: z.string(),
          description: z.string(),
          metrics: z.array(z.object({
            label: z.string(),
            value: z.string(),
          })),
        })),
        pricingTiers: z.array(z.object({
          name: z.string(),
          price: z.number(),
          features: z.array(z.string()),
          recommended: z.boolean().optional(),
        })),
        addOns: z.array(z.object({
          id: z.string(),
          name: z.string(),
          price: z.number(),
          description: z.string(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createProposal({
          userId: ctx.user.id,
          status: "draft",
          ...input,
        });
        return { id };
      }),

    // Update proposal
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          clientName: z.string().optional(),
          projectName: z.string().optional(),
          validUntil: z.date().optional(),
          status: z.enum(["draft", "sent", "viewed", "signed", "expired"]).optional(),
          problems: z.array(z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string(),
          })).optional(),
          solutionPhases: z.array(z.object({
            title: z.string(),
            duration: z.string(),
          })).optional(),
          deliverables: z.array(z.string()).optional(),
          caseStudies: z.array(z.object({
            title: z.string(),
            description: z.string(),
            metrics: z.array(z.object({
              label: z.string(),
              value: z.string(),
            })),
          })).optional(),
          pricingTiers: z.array(z.object({
            name: z.string(),
            price: z.number(),
            features: z.array(z.string()),
            recommended: z.boolean().optional(),
          })).optional(),
          addOns: z.array(z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            description: z.string(),
          })).optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateProposal(input.id, input.data);
        return { success: true };
      }),

    // Delete proposal
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProposal(input.id);
        return { success: true };
      }),

    // Get analytics for a proposal
    analytics: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getProposalAnalytics(input.id);
      }),
  }),

  tracking: router({
    // Track proposal view
    trackView: publicProcedure
      .input(z.object({
        proposalId: z.number(),
        sessionId: z.string(),
        viewerEmail: z.string().optional(),
        viewerIp: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createOrUpdateProposalView(input);
        return { success: true };
      }),

    // Track engagement event
    trackEvent: publicProcedure
      .input(z.object({
        proposalId: z.number(),
        sessionId: z.string(),
        eventType: z.enum([
          "section_viewed",
          "pricing_changed",
          "addon_toggled",
          "signature_started",
          "form_filled"
        ]),
        eventData: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createEngagementEvent(input);
        return { success: true };
      }),
  }),

  signatures: router({
    // Submit signature
    submit: publicProcedure
      .input(z.object({
        proposalId: z.number(),
        signerName: z.string(),
        signerEmail: z.string().email(),
        signatureData: z.string(),
        selectedTier: z.string(),
        selectedAddOns: z.array(z.string()),
        totalPrice: z.number(),
        ipAddress: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createSignature(input);
        return { success: true };
      }),

    // Get signature for proposal
    get: publicProcedure
      .input(z.object({ proposalId: z.number() }))
      .query(async ({ input }) => {
        return db.getSignatureByProposalId(input.proposalId);
      }),
  }),
});

export type AppRouter = typeof appRouter;

