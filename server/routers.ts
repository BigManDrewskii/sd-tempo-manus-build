import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { z } from "zod";

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
          status: z.enum(["draft", "published", "archived"]).optional(),
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

    // Duplicate proposal
    duplicate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const newId = await db.duplicateProposal(input.id, ctx.user.id);
        return { id: newId };
      }),

    // Get analytics for a proposal
    analytics: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getProposalAnalytics(input.id);
      }),

    // Generate proposal with AI
    generateWithAI: protectedProcedure
      .input(
        z.object({
          clientName: z.string().min(1),
          projectName: z.string().min(1),
          industry: z.string().min(1),
          projectDescription: z.string().min(10),
          budgetRange: z.enum(["low", "medium", "high"]),
          timeline: z.enum(["urgent", "normal", "extended"]),
          serviceType: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const systemPrompt = `You are an expert business proposal writer with 15+ years of experience.`;

        const budgetRanges = {
          low: { min: 5000, max: 15000 },
          medium: { min: 15000, max: 50000 },
          high: { min: 50000, max: 150000 },
        };

        const timelineMap = {
          urgent: "1-2 weeks",
          normal: "4-8 weeks",
          extended: "3-6 months",
        };

        const userPrompt = `Generate a comprehensive business proposal for:

Client: ${input.clientName}
Project: ${input.projectName}
Industry: ${input.industry}
Description: ${input.projectDescription}
Budget: $${budgetRanges[input.budgetRange].min.toLocaleString()} - $${budgetRanges[input.budgetRange].max.toLocaleString()}
Timeline: ${timelineMap[input.timeline]}
Service: ${input.serviceType}

Include: 3-4 problems, 4-5 solution phases, 6-8 deliverables, 2 case studies, 3 pricing tiers, 3 add-ons.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "proposal_content",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  problems: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        icon: { type: "string" },
                      },
                      required: ["title", "description", "icon"],
                      additionalProperties: false,
                    },
                  },
                  solutionPhases: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        duration: { type: "string" },
                      },
                      required: ["title", "duration"],
                      additionalProperties: false,
                    },
                  },
                  deliverables: {
                    type: "array",
                    items: { type: "string" },
                  },
                  caseStudies: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        metrics: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              label: { type: "string" },
                              value: { type: "string" },
                            },
                            required: ["label", "value"],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ["title", "description", "metrics"],
                      additionalProperties: false,
                    },
                  },
                  pricingTiers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        price: { type: "number" },
                        features: {
                          type: "array",
                          items: { type: "string" },
                        },
                        recommended: { type: "boolean" },
                      },
                      required: ["name", "price", "features"],
                      additionalProperties: false,
                    },
                  },
                  addOns: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        price: { type: "number" },
                        description: { type: "string" },
                      },
                      required: ["id", "name", "price", "description"],
                      additionalProperties: false,
                    },
                  },
                },
                required: [
                  "problems",
                  "solutionPhases",
                  "deliverables",
                  "caseStudies",
                  "pricingTiers",
                  "addOns",
                ],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0].message.content;
        if (!content || typeof content !== "string") {
          throw new Error("No content generated");
        }

        const generatedData = JSON.parse(content);

        return {
          ...generatedData,
          clientName: input.clientName,
          projectName: input.projectName,
        };
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
    // Create signature
    create: publicProcedure
      .input(
        z.object({
          proposalId: z.number(),
          fullName: z.string().min(1),
          email: z.string().email(),
          signatureData: z.string().min(1),
          selectedTier: z.string(),
          selectedAddOns: z.record(z.string(), z.boolean()),
          totalPrice: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createSignature(input);
      }),

    // Get signature for proposal
    getByProposalId: publicProcedure
      .input(z.object({ proposalId: z.number() }))
      .query(async ({ input }) => {
        return db.getSignatureByProposalId(input.proposalId);
      }),
  }),

  templates: router({
    // List all public templates
    list: publicProcedure.query(async () => {
      return db.getAllTemplates();
    }),

    // Get single template by ID
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getTemplateById(input.id);
      }),

    // Clone template to create new proposal
    clone: protectedProcedure
      .input(
        z.object({
          templateId: z.number(),
          clientName: z.string().min(1),
          projectName: z.string().min(1),
          validUntil: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const template = await db.getTemplateById(input.templateId);
        if (!template) {
          throw new Error("Template not found");
        }

        // Create proposal from template
        const proposalId = await db.createProposal({
          userId: ctx.user.id,
          title: `${input.projectName} Proposal`,
          clientName: input.clientName,
          projectName: input.projectName,
          validUntil: new Date(input.validUntil),
          problems: template.problems,
          solutionPhases: template.solutionPhases,
          deliverables: template.deliverables,
          caseStudies: template.caseStudies,
          pricingTiers: template.pricingTiers,
          addOns: template.addOns,
          status: "draft",
        });

        return { proposalId };
      }),
  }),
});

export type AppRouter = typeof appRouter;

