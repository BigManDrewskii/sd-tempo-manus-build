import { proposalThemes, type ProposalTheme } from "@shared/themes";
import { Check } from "lucide-react";

interface ThemeSelectorProps {
  selectedTheme: ProposalTheme;
  onThemeChange: (theme: ProposalTheme) => void;
}

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  const themes = Object.values(proposalThemes);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {themes.map((theme) => {
        const isSelected = selectedTheme === theme.id;
        
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onThemeChange(theme.id)}
            className={`
              relative p-4 rounded-lg border-2 transition-all text-left
              ${isSelected 
                ? "border-[#644a40] ring-2 ring-[#644a40] ring-offset-2" 
                : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            {/* Theme Preview */}
            <div className="space-y-3">
              {/* Color Swatches */}
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-200"
                  style={{ backgroundColor: theme.colors.primary }}
                  title="Primary"
                />
                <div 
                  className="w-8 h-8 rounded border border-gray-200"
                  style={{ backgroundColor: theme.colors.secondary }}
                  title="Secondary"
                />
                <div 
                  className="w-8 h-8 rounded border border-gray-200"
                  style={{ backgroundColor: theme.colors.accent }}
                  title="Accent"
                />
              </div>

              {/* Theme Info */}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                  {theme.name}
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#644a40]" />
                  )}
                </h3>
                <p className="text-xs text-gray-500 mt-2">{theme.description}</p>
              </div>

              {/* Font Preview */}
              <div className="text-xs text-gray-400" style={{ fontFamily: theme.fonts.heading }}>
                Aa
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

