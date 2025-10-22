import { drizzle } from "drizzle-orm/mysql2";
import { templates } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const templateData = [
  {
    name: "Web Design & Development",
    description: "Complete website design and development proposal for agencies and freelancers",
    industry: "web-design" as const,
    thumbnail: null,
    isPublic: true,
    createdBy: null,
    problems: [
      {
        title: "Outdated Website Design",
        description: "Your current website doesn't reflect your brand's evolution and fails to engage modern users with outdated design patterns and poor mobile experience.",
        icon: "Monitor"
      },
      {
        title: "Poor User Experience",
        description: "Visitors struggle to find information, leading to high bounce rates and lost conversions. Navigation is confusing and key actions are buried.",
        icon: "MousePointer"
      },
      {
        title: "Slow Performance",
        description: "Page load times exceed 3 seconds, causing visitor frustration and hurting SEO rankings. Images aren't optimized and code is bloated.",
        icon: "Zap"
      },
      {
        title: "Difficult Content Management",
        description: "Updating website content requires developer intervention, slowing down marketing efforts and increasing costs for simple changes.",
        icon: "Edit"
      }
    ],
    solutionPhases: [
      {title: "Discovery & Strategy", duration: "1 Week"},
      {title: "Design & Prototyping", duration: "2 Weeks"},
      {title: "Development & Integration", duration: "4 Weeks"},
      {title: "Testing & QA", duration: "1 Week"},
      {title: "Launch & Training", duration: "1 Week"}
    ],
    deliverables: [
      "Complete sitemap and information architecture",
      "High-fidelity design mockups for all pages",
      "Responsive website (desktop, tablet, mobile)",
      "Content Management System (CMS) integration",
      "SEO optimization and meta tags",
      "Contact forms and lead capture",
      "Analytics setup and tracking",
      "Training documentation and videos"
    ],
    caseStudies: [
      {
        title: "E-commerce Redesign Success",
        description: "Redesigned online store for fashion retailer, focusing on mobile-first design and streamlined checkout process.",
        metrics: [
          {label: "Conversion Rate", value: "+67%"},
          {label: "Mobile Traffic", value: "+120%"},
          {label: "Page Load Time", value: "-58%"},
          {label: "Bounce Rate", value: "-42%"}
        ]
      },
      {
        title: "SaaS Platform Transformation",
        description: "Rebuilt marketing website for B2B SaaS company with focus on lead generation and product storytelling.",
        metrics: [
          {label: "Demo Requests", value: "+89%"},
          {label: "Time on Site", value: "+3.2 min"},
          {label: "Organic Traffic", value: "+145%"},
          {label: "Lead Quality Score", value: "+34%"}
        ]
      }
    ],
    pricingTiers: [
      {
        name: "Essential",
        price: 8500,
        features: [
          "Up to 5 custom pages",
          "Mobile-responsive design",
          "Basic CMS integration",
          "Contact form setup",
          "1 month post-launch support"
        ],
        recommended: false
      },
      {
        name: "Professional",
        price: 15000,
        features: [
          "Up to 10 custom pages",
          "Advanced animations & interactions",
          "Full CMS with blog functionality",
          "SEO optimization package",
          "Analytics & tracking setup",
          "3 months post-launch support"
        ],
        recommended: true
      },
      {
        name: "Enterprise",
        price: 28000,
        features: [
          "Unlimited custom pages",
          "Custom CMS development",
          "Advanced integrations (CRM, email, etc)",
          "Performance optimization",
          "Accessibility compliance (WCAG)",
          "6 months premium support"
        ],
        recommended: false
      }
    ],
    addOns: [
      {
        id: "copywriting",
        name: "Professional Copywriting",
        price: 2500,
        description: "SEO-optimized copy for all pages written by experienced content strategists"
      },
      {
        id: "photography",
        name: "Custom Photography",
        price: 3500,
        description: "Professional photo shoot and image editing for authentic brand visuals"
      },
      {
        id: "maintenance",
        name: "Annual Maintenance Plan",
        price: 4800,
        description: "12 months of updates, security patches, backups, and technical support"
      }
    ]
  },
  {
    name: "Business Consulting",
    description: "Strategic business consulting proposal for consultants and advisory firms",
    industry: "consulting" as const,
    thumbnail: null,
    isPublic: true,
    createdBy: null,
    problems: [
      {
        title: "Stagnant Growth",
        description: "Revenue has plateaued despite market opportunities. Current strategies aren't delivering the growth needed to meet business objectives.",
        icon: "TrendingDown"
      },
      {
        title: "Operational Inefficiencies",
        description: "Processes are manual and time-consuming, leading to wasted resources and inability to scale operations effectively.",
        icon: "Settings"
      },
      {
        title: "Unclear Market Position",
        description: "Brand messaging is inconsistent and value proposition isn't differentiated from competitors, making it difficult to win new business.",
        icon: "Target"
      },
      {
        title: "Team Alignment Issues",
        description: "Departments work in silos with conflicting priorities, resulting in duplicated efforts and missed opportunities for collaboration.",
        icon: "Users"
      }
    ],
    solutionPhases: [
      {title: "Business Assessment", duration: "2 Weeks"},
      {title: "Strategy Development", duration: "3 Weeks"},
      {title: "Implementation Planning", duration: "2 Weeks"},
      {title: "Execution Support", duration: "8 Weeks"},
      {title: "Review & Optimization", duration: "1 Week"}
    ],
    deliverables: [
      "Comprehensive business analysis report",
      "Market opportunity assessment",
      "Strategic growth roadmap (12-24 months)",
      "Operational improvement recommendations",
      "Brand positioning framework",
      "Implementation timeline and milestones",
      "KPI dashboard and tracking system",
      "Executive presentation deck"
    ],
    caseStudies: [
      {
        title: "Manufacturing Turnaround",
        description: "Helped mid-size manufacturer streamline operations and expand into new markets through strategic planning and process optimization.",
        metrics: [
          {label: "Revenue Growth", value: "+42%"},
          {label: "Operating Costs", value: "-28%"},
          {label: "Market Share", value: "+15%"},
          {label: "Employee Satisfaction", value: "+31%"}
        ]
      },
      {
        title: "Tech Startup Scale-Up",
        description: "Guided SaaS startup through rapid growth phase with strategic planning, team structure, and go-to-market strategy.",
        metrics: [
          {label: "ARR Growth", value: "+210%"},
          {label: "Customer Acquisition Cost", value: "-35%"},
          {label: "Team Productivity", value: "+48%"},
          {label: "Churn Rate", value: "-52%"}
        ]
      }
    ],
    pricingTiers: [
      {
        name: "Foundation",
        price: 12000,
        features: [
          "2-week business assessment",
          "Strategic recommendations report",
          "1 executive workshop",
          "30-day implementation support",
          "Monthly check-in calls"
        ],
        recommended: false
      },
      {
        name: "Growth",
        price: 28000,
        features: [
          "Complete business analysis",
          "12-month strategic roadmap",
          "3 executive workshops",
          "90-day hands-on implementation",
          "Weekly progress meetings",
          "KPI tracking dashboard"
        ],
        recommended: true
      },
      {
        name: "Transformation",
        price: 55000,
        features: [
          "Full organizational assessment",
          "24-month transformation plan",
          "Unlimited workshops & training",
          "6-month embedded consulting",
          "Change management support",
          "Executive coaching included"
        ],
        recommended: false
      }
    ],
    addOns: [
      {
        id: "market-research",
        name: "Market Research Study",
        price: 8000,
        description: "In-depth competitive analysis and customer research with actionable insights"
      },
      {
        id: "team-training",
        name: "Team Training Program",
        price: 5500,
        description: "Custom training workshops for leadership and staff on new processes and strategies"
      },
      {
        id: "ongoing-advisory",
        name: "Ongoing Advisory Retainer",
        price: 6000,
        description: "Monthly retainer for continued strategic guidance and quarterly business reviews"
      }
    ]
  },
  {
    name: "SaaS Product Development",
    description: "Complete SaaS product development proposal for tech companies and startups",
    industry: "saas" as const,
    thumbnail: null,
    isPublic: true,
    createdBy: null,
    problems: [
      {
        title: "Manual Processes Slowing Growth",
        description: "Current workflows rely on spreadsheets and disconnected tools, limiting scalability and creating data inconsistencies across teams.",
        icon: "AlertCircle"
      },
      {
        title: "High Development Costs",
        description: "Building custom software in-house requires significant investment in hiring, infrastructure, and ongoing maintenance that strains budgets.",
        icon: "DollarSign"
      },
      {
        title: "Slow Time to Market",
        description: "Traditional development cycles take 12+ months, allowing competitors to capture market share while you're still building.",
        icon: "Clock"
      },
      {
        title: "Technical Debt & Scalability",
        description: "Legacy systems can't handle growing user base or feature demands, requiring expensive rewrites and causing downtime.",
        icon: "Database"
      }
    ],
    solutionPhases: [
      {title: "Product Discovery", duration: "2 Weeks"},
      {title: "MVP Design & Planning", duration: "2 Weeks"},
      {title: "Core Development", duration: "8 Weeks"},
      {title: "Testing & Refinement", duration: "2 Weeks"},
      {title: "Launch & Iteration", duration: "2 Weeks"}
    ],
    deliverables: [
      "Product requirements document (PRD)",
      "User flow diagrams and wireframes",
      "High-fidelity UI/UX design system",
      "Fully functional web application",
      "RESTful API with documentation",
      "Admin dashboard and analytics",
      "User authentication and security",
      "Cloud deployment and hosting setup",
      "Technical documentation",
      "90-day post-launch support"
    ],
    caseStudies: [
      {
        title: "Project Management Platform",
        description: "Built collaborative project management SaaS for creative agencies with real-time updates and client portals.",
        metrics: [
          {label: "Active Users", value: "2,500+"},
          {label: "MRR Growth", value: "+180%"},
          {label: "Uptime", value: "99.9%"},
          {label: "NPS Score", value: "72"}
        ]
      },
      {
        title: "HR Analytics Dashboard",
        description: "Developed data analytics platform for HR teams to track employee engagement and performance metrics.",
        metrics: [
          {label: "Enterprise Clients", value: "45+"},
          {label: "Data Processing", value: "10M+ records"},
          {label: "Customer Retention", value: "94%"},
          {label: "Support Tickets", value: "-68%"}
        ]
      }
    ],
    pricingTiers: [
      {
        name: "MVP Launch",
        price: 45000,
        features: [
          "Core feature set (3-5 features)",
          "Web application (responsive)",
          "Basic API integration",
          "User authentication",
          "Cloud hosting setup",
          "3 months support"
        ],
        recommended: false
      },
      {
        name: "Full Product",
        price: 85000,
        features: [
          "Complete feature set (8-12 features)",
          "Advanced UI/UX design",
          "Full API with documentation",
          "Admin dashboard",
          "Payment integration",
          "Analytics & reporting",
          "6 months support"
        ],
        recommended: true
      },
      {
        name: "Enterprise",
        price: 150000,
        features: [
          "Unlimited features",
          "Custom integrations",
          "Advanced security & compliance",
          "Multi-tenant architecture",
          "White-label options",
          "Dedicated development team",
          "12 months premium support"
        ],
        recommended: false
      }
    ],
    addOns: [
      {
        id: "mobile-apps",
        name: "Native Mobile Apps",
        price: 35000,
        description: "iOS and Android native applications with offline capabilities"
      },
      {
        id: "advanced-analytics",
        name: "Advanced Analytics Module",
        price: 12000,
        description: "Custom reporting, data visualization, and business intelligence features"
      },
      {
        id: "api-development",
        name: "Public API Development",
        price: 18000,
        description: "Developer-friendly API with SDKs, webhooks, and comprehensive documentation"
      }
    ]
  }
];

async function seed() {
  console.log("Seeding templates...");
  
  for (const template of templateData) {
    await db.insert(templates).values(template);
    console.log(`✓ Created template: ${template.name}`);
  }
  
  console.log("✓ All templates seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding templates:", error);
  process.exit(1);
});

