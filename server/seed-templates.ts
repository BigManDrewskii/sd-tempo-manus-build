import * as db from "./db";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedTemplates() {
  console.log("🌱 Seeding templates...");

  try {
    // Read template data
    const templateData = JSON.parse(
      readFileSync("/home/ubuntu/template_seed_data.json", "utf-8")
    );

    let count = 0;
    for (const template of templateData) {
      try {
        await db.createTemplate({
          name: template.name,
          description: template.description,
          industry: template.industry,
          problems: template.problems,
          solutionPhases: template.solutionPhases,
          deliverables: template.deliverables || [],
          caseStudies: template.caseStudies,
          pricingTiers: template.pricingTiers,
          addOns: template.addOns,
        });
        count++;
        console.log(`✅ Created template: ${template.name}`);
      } catch (error: any) {
        console.error(`❌ Failed to create template ${template.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully seeded ${count}/${templateData.length} templates!`);
  } catch (error: any) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
}

// Run seed
seedTemplates()
  .then(() => {
    console.log("✨ Seed complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seed error:", error);
    process.exit(1);
  });

