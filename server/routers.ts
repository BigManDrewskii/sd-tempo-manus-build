import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { z } from "zod";
import { sanitizeObject } from "../shared/sanitize";

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
    // List user's proposals with pagination
    list: protectedProcedure
      .input(z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      }).optional())
      .query(async ({ ctx, input }) => {
        const page = input?.page || 1;
        const limit = input?.limit || 20;
        const offset = (page - 1) * limit;
        
        const proposals = await db.getUserProposals(ctx.user.id);
        const total = proposals.length;
        const paginatedProposals = proposals.slice(offset, offset + limit);
        
        return {
          proposals: paginatedProposals,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
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
          duration: z.string().optional(),
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
        // Sanitize user input to prevent XSS
        const sanitizedInput = sanitizeObject(input, ['description']);
        
        const id = await db.createProposal({
          userId: ctx.user.id,
          status: "draft",
          ...sanitizedInput,
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
          theme: z.enum(["default", "modern", "classic", "bold", "minimal", "elegant"]).optional(),
          problems: z.array(z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string(),
          })).optional(),
          solutionPhases: z.array(z.object({
            title: z.string(),
            duration: z.string().optional(),
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
      .mutation(async ({ input, ctx }) => {
        // Verify ownership
        await db.requireProposalOwnership(input.id, ctx.user.id);
        
        // Sanitize user input to prevent XSS
        const sanitizedData = sanitizeObject(input.data, ['description']);
        
        await db.updateProposal(input.id, sanitizedData);
        return { success: true };
      }),

    // Delete proposal
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Verify ownership
        await db.requireProposalOwnership(input.id, ctx.user.id);
        await db.deleteProposal(input.id);
        return { success: true };
      }),
      
    // Bulk archive proposals
    bulkArchive: protectedProcedure
      .input(z.object({ ids: z.array(z.number()) }))
      .mutation(async ({ input, ctx }) => {
        // Verify ownership for all proposals
        for (const id of input.ids) {
          await db.requireProposalOwnership(id, ctx.user.id);
        }
        // Archive all proposals
        for (const id of input.ids) {
          await db.updateProposal(id, { status: "archived" });
        }
        return { success: true, count: input.ids.length };
      }),
      
    // Bulk restore proposals
    bulkRestore: protectedProcedure
      .input(z.object({ ids: z.array(z.number()) }))
      .mutation(async ({ input, ctx }) => {
        // Verify ownership for all proposals
        for (const id of input.ids) {
          await db.requireProposalOwnership(id, ctx.user.id);
        }
        // Restore all proposals to draft
        for (const id of input.ids) {
          await db.updateProposal(id, { status: "draft" });
        }
        return { success: true, count: input.ids.length };
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
      .query(async ({ input, ctx }) => {
        // Verify ownership
        await db.requireProposalOwnership(input.id, ctx.user.id);
        return db.getProposalAnalytics(input.id);
      }),

    // Export proposal as PDF
    exportPDF: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const { generateProposalPDF } = await import("./utils/pdfGenerator");
        // Verify ownership
        const proposal = await db.requireProposalOwnership(input.id, ctx.user.id);
        
        const pdfBuffer = await generateProposalPDF(proposal);
        const base64PDF = pdfBuffer.toString("base64");
        
        return {
          filename: `${proposal.projectName.replace(/[^a-z0-9]/gi, '_')}_proposal.pdf`,
          data: base64PDF,
        };
      }),

    // Send proposal via email
    sendEmail: protectedProcedure
      .input(
        z.object({
          proposalId: z.number(),
          recipientEmail: z.string().email(),
          recipientName: z.string().optional(),
          subject: z.string().optional(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const {
          generateTrackingToken,
          buildProposalEmailHtml,
          sendProposalEmail,
          getTrackingPixelUrl,
          getProposalUrlWithTracking,
        } = await import("./email");

        // Verify ownership and get proposal
        const proposal = await db.requireProposalOwnership(input.proposalId, ctx.user.id);

        // Generate tracking token
        const trackingToken = generateTrackingToken();

        // Create email delivery record
        const deliveryId = await db.createEmailDelivery({
          proposalId: input.proposalId,
          userId: ctx.user.id,
          recipientEmail: input.recipientEmail,
          recipientName: input.recipientName || null,
          subject: input.subject || `Proposal: ${proposal.title}`,
          message: input.message || null,
          trackingToken,
          status: "pending",
        });

        // Build email HTML
        const proposalUrl = getProposalUrlWithTracking(
          input.proposalId,
          trackingToken
        );
        const trackingPixelUrl = getTrackingPixelUrl(trackingToken);

        const emailHtml = buildProposalEmailHtml({
          proposalTitle: proposal.title,
          senderName: ctx.user.name || "Your Partner",
          clientName: input.recipientName || proposal.clientName,
          projectName: proposal.projectName,
          expirationDate: new Date(proposal.validUntil).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          ),
          customMessage: input.message,
          proposalUrl,
          trackingPixelUrl,
        });

        // Send email
        const result = await sendProposalEmail({
          to: input.recipientEmail,
          subject: input.subject || `Proposal: ${proposal.title}`,
          html: emailHtml,
        });

        // Update delivery status
        if (result.success) {
          await db.updateEmailDelivery(deliveryId, {
            status: "sent",
            sentAt: new Date(),
          });

          // Track event
          await db.createEmailTrackingEvent({
            deliveryId,
            eventType: "open",
            eventData: { action: "email_sent" },
          });
        } else {
          await db.updateEmailDelivery(deliveryId, {
            status: "failed",
          });
        }

        return {
          success: result.success,
          error: result.error,
          deliveryId,
        };
      }),

    // Get email delivery stats for a proposal
    getEmailStats: protectedProcedure
      .input(z.object({ proposalId: z.number() }))
      .query(async ({ input, ctx }) => {
        // Verify ownership
        await db.requireProposalOwnership(input.proposalId, ctx.user.id);
        const deliveries = await db.getEmailDeliveriesByProposal(
          input.proposalId
        );

        const totalSent = deliveries.length;
        const totalOpened = deliveries.filter((d) => d.openedAt).length;
        const totalViewed = deliveries.filter((d) => d.lastViewedAt).length;
        const totalTimeSpent = deliveries.reduce(
          (sum, d) => sum + d.totalTimeSpent,
          0
        );

        return {
          totalSent,
          totalOpened,
          totalViewed,
          openRate:
            totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
          viewRate:
            totalSent > 0 ? Math.round((totalViewed / totalSent) * 100) : 0,
          avgTimeSpent:
            totalViewed > 0 ? Math.round(totalTimeSpent / totalViewed) : 0,
          deliveries,
        };
      }),

    // Get email activity timeline
    getEmailActivity: protectedProcedure
      .input(z.object({ proposalId: z.number() }))
      .query(async ({ input }) => {
        return db.getProposalEmailActivity(input.proposalId);
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
        // Transform selectedAddOns from Record<string, boolean> to string[]
        const selectedAddOnsList = Object.keys(input.selectedAddOns).filter(
          key => input.selectedAddOns[key]
        );
        
        return db.createSignature({
          proposalId: input.proposalId,
          signerName: input.fullName,
          signerEmail: input.email,
          signatureData: input.signatureData,
          selectedTier: input.selectedTier,
          selectedAddOns: selectedAddOnsList,
          totalPrice: input.totalPrice,
        });
      }),

    // Get signature for proposal
    get: publicProcedure
      .input(z.object({ proposalId: z.number() }))
      .query(async ({ input }) => {
        return db.getSignatureByProposalId(input.proposalId);
      }),
    
    // Alias for backward compatibility
    getByProposalId: publicProcedure
      .input(z.object({ proposalId: z.number() }))
      .query(async ({ input }) => {
        return db.getSignatureByProposalId(input.proposalId);
      }),
    
    // Submit signature (alias for create)
    submit: publicProcedure
      .input(
        z.object({
          proposalId: z.number(),
          signerName: z.string().min(1),
          signerEmail: z.string().email(),
          signatureData: z.string().min(1),
          selectedTier: z.string(),
          selectedAddOns: z.array(z.string()),
          totalPrice: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createSignature(input);
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

  branding: router({
    // Get user's branding settings
    get: protectedProcedure.query(async ({ ctx }) => {
      const branding = await db.getUserBranding(ctx.user.id);
      return branding || {
        primaryColor: "#644a40",
        secondaryColor: "#ffdfb5",
        accentColor: "#ffffff",
        fontFamily: "Inter",
      };
    }),

    // Update branding settings
    update: protectedProcedure
      .input(
        z.object({
          logoUrl: z.string().optional(),
          primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
          secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
          accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
          fontFamily: z.string(),
          companyName: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const branding = await db.upsertUserBranding({
          userId: ctx.user.id,
          ...input,
        });
        return branding;
      }),

    // Upload logo
    uploadLogo: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileData: z.string(), // base64
          mimeType: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { storagePut } = await import("./storage");
        const buffer = Buffer.from(input.fileData, "base64");
        const key = `branding/${ctx.user.id}/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        return { url };
      }),
  }),
});

export type AppRouter = typeof appRouter;

