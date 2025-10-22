export type ProposalTheme = "default" | "modern" | "classic" | "bold" | "minimal" | "elegant";

export interface ThemeConfig {
  id: ProposalTheme;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textMuted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: string;
  shadow: string;
}

export const proposalThemes: Record<ProposalTheme, ThemeConfig> = {
  default: {
    id: "default",
    name: "Tempo",
    description: "Warm, approachable, professional",
    colors: {
      primary: "#644a40",
      secondary: "#ffdfb5",
      accent: "#ffffff",
      background: "#ffdfb5",
      text: "#1f2937",
      textMuted: "#6b7280",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    borderRadius: "0.5rem",
    shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },

  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean, contemporary, tech-forward",
    colors: {
      primary: "#0f172a",
      secondary: "#3b82f6",
      accent: "#60a5fa",
      background: "#f8fafc",
      text: "#0f172a",
      textMuted: "#64748b",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    borderRadius: "0.25rem",
    shadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },

  classic: {
    id: "classic",
    name: "Classic",
    description: "Traditional, trustworthy, corporate",
    colors: {
      primary: "#1e3a8a",
      secondary: "#dbeafe",
      accent: "#3b82f6",
      background: "#ffffff",
      text: "#1e293b",
      textMuted: "#64748b",
    },
    fonts: {
      heading: "Georgia, serif",
      body: "Georgia, serif",
    },
    borderRadius: "0.75rem",
    shadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
  },

  bold: {
    id: "bold",
    name: "Bold",
    description: "Confident, energetic, attention-grabbing",
    colors: {
      primary: "#dc2626",
      secondary: "#fef2f2",
      accent: "#f59e0b",
      background: "#ffffff",
      text: "#18181b",
      textMuted: "#71717a",
    },
    fonts: {
      heading: "Montserrat, sans-serif",
      body: "Inter, sans-serif",
    },
    borderRadius: "0.5rem",
    shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },

  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Clean, simple, Scandinavian-inspired",
    colors: {
      primary: "#000000",
      secondary: "#f5f5f5",
      accent: "#737373",
      background: "#ffffff",
      text: "#000000",
      textMuted: "#737373",
    },
    fonts: {
      heading: "Helvetica, Arial, sans-serif",
      body: "Helvetica, Arial, sans-serif",
    },
    borderRadius: "0rem",
    shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  },

  elegant: {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated, luxury, premium",
    colors: {
      primary: "#581c87",
      secondary: "#faf5ff",
      accent: "#a855f7",
      background: "#ffffff",
      text: "#1e1b4b",
      textMuted: "#6b7280",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Inter, sans-serif",
    },
    borderRadius: "0.5rem",
    shadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
  },
};

export function getTheme(themeId: ProposalTheme): ThemeConfig {
  return proposalThemes[themeId] || proposalThemes.default;
}

