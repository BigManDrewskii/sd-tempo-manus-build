import PDFDocument from "pdfkit";
import { Readable } from "stream";

interface ProposalData {
  projectName: string;
  clientName: string;
  validUntil: Date;
  problems: Array<{ title: string; description: string }>;
  solutionPhases: Array<{ title: string; duration: string; description?: string }>;
  deliverables: string[];
  pricingTiers: Array<{ name: string; price: number; features: string[] }>;
  addOns: Array<{ name: string; description: string; price: number }>;
  caseStudies?: Array<{ title: string; description: string; metrics: Array<{ label: string; value: string }> }>;
}

export async function generateProposalPDF(proposal: ProposalData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Colors matching Tempo branding
    const primaryColor = "#644a40"; // Brown
    const secondaryColor = "#ffdfb5"; // Peach
    const textColor = "#1a1a1a";
    const mutedColor = "#666666";

    // Helper functions
    const addSection = (title: string) => {
      doc.moveDown(2);
      doc
        .fontSize(20)
        .fillColor(primaryColor)
        .text(title, { underline: true });
      doc.moveDown(0.5);
      doc.fillColor(textColor);
    };

    const addSubtitle = (text: string) => {
      doc.fontSize(14).fillColor(primaryColor).text(text);
      doc.fillColor(textColor);
    };

    const addBody = (text: string) => {
      doc.fontSize(11).fillColor(textColor).text(text);
    };

    const addMuted = (text: string) => {
      doc.fontSize(10).fillColor(mutedColor).text(text);
      doc.fillColor(textColor);
    };

    // Cover Page
    doc
      .fontSize(36)
      .fillColor(primaryColor)
      .text(proposal.projectName, { align: "center" });
    
    doc.moveDown(1);
    doc
      .fontSize(20)
      .fillColor(textColor)
      .text(`Proposal for ${proposal.clientName}`, { align: "center" });

    doc.moveDown(2);
    doc
      .fontSize(12)
      .fillColor(mutedColor)
      .text(
        `Valid until ${new Date(proposal.validUntil).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        { align: "center" }
      );

    doc.moveDown(4);
    doc
      .fontSize(14)
      .fillColor(primaryColor)
      .text("Tempo - Interactive Proposal Builder", { align: "center" });

    // New page for content
    doc.addPage();

    // Problems Section
    if (proposal.problems && proposal.problems.length > 0) {
      addSection("The Challenge");
      proposal.problems.forEach((problem, index) => {
        doc.moveDown(0.5);
        addSubtitle(`${index + 1}. ${problem.title}`);
        doc.moveDown(0.3);
        addBody(problem.description);
      });
    }

    // Solution Timeline
    if (proposal.solutionPhases && proposal.solutionPhases.length > 0) {
      addSection("Our Solution");
      addBody("Project Timeline:");
      doc.moveDown(0.5);
      
      proposal.solutionPhases.forEach((phase, index) => {
        doc.moveDown(0.3);
        addSubtitle(`Phase ${index + 1}: ${phase.title}`);
        addMuted(`Duration: ${phase.duration}`);
        if (phase.description) {
          doc.moveDown(0.2);
          addBody(phase.description);
        }
      });
    }

    // Deliverables
    if (proposal.deliverables && proposal.deliverables.length > 0) {
      addSection("Deliverables");
      proposal.deliverables.forEach((deliverable) => {
        doc.moveDown(0.3);
        addBody(`• ${deliverable}`);
      });
    }

    // Pricing
    if (proposal.pricingTiers && proposal.pricingTiers.length > 0) {
      doc.addPage();
      addSection("Investment Options");
      
      proposal.pricingTiers.forEach((tier) => {
        doc.moveDown(0.8);
        doc
          .fontSize(16)
          .fillColor(primaryColor)
          .text(`${tier.name} - $${tier.price.toLocaleString()}`);
        
        doc.moveDown(0.3);
        tier.features.forEach((feature) => {
          addBody(`  ✓ ${feature}`);
        });
      });
    }

    // Add-ons
    if (proposal.addOns && proposal.addOns.length > 0) {
      addSection("Optional Add-ons");
      proposal.addOns.forEach((addOn) => {
        doc.moveDown(0.5);
        addSubtitle(`${addOn.name} - $${addOn.price.toLocaleString()}`);
        doc.moveDown(0.2);
        addBody(addOn.description);
      });
    }

    // Case Studies
    if (proposal.caseStudies && proposal.caseStudies.length > 0) {
      doc.addPage();
      addSection("Proven Results");
      proposal.caseStudies.forEach((study) => {
        doc.moveDown(0.8);
        addSubtitle(study.title);
        doc.moveDown(0.3);
        addBody(study.description);
        if (study.metrics && study.metrics.length > 0) {
          doc.moveDown(0.5);
          study.metrics.forEach((metric) => {
            doc.moveDown(0.3);
            doc
              .fontSize(24)
              .fillColor(primaryColor)
              .text(metric.value, { align: "center" });
            doc.moveDown(0.2);
            addMuted(metric.label);
          });
        }
      });
    }

    // Footer on last page
    doc.moveDown(3);
    doc
      .fontSize(10)
      .fillColor(mutedColor)
      .text(
        "Generated by Tempo - Interactive Proposal Builder",
        { align: "center" }
      );

    doc.end();
  });
}

