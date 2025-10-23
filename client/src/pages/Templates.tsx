import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Search, FileText } from "lucide-react";
import { CustomizeTemplateDialog } from "@/components/CustomizeTemplateDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "web-design", label: "Web Design" },
  { id: "consulting", label: "Consulting" },
  { id: "saas", label: "SaaS" },
  { id: "marketing", label: "Marketing" },
  { id: "mobile-app", label: "Mobile App" },
  { id: "ecommerce", label: "E-commerce" },
];

export default function Templates() {
  const { user, isAuthenticated } = useAuth();
  const { data: templates, isLoading } = trpc.templates.list.useQuery();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const filteredTemplates = templates?.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.industry === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setCustomizeDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-black rounded-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-black">
              Proposal Templates
            </h1>
          </div>
          <p className="text-lg text-gray-600 ml-[68px]">
            Start with a professional template and customize it for your client
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 border-gray-300"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  selectedCategory === category.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates && filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const lowestPrice = Math.min(...template.pricingTiers.map((t: any) => t.price));
              const highestPrice = Math.max(...template.pricingTiers.map((t: any) => t.price));

              return (
                <div
                  key={template.id}
                  className="border border-gray-200 hover:border-gray-400 transition-colors group"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-200">
                    <Badge variant="secondary" className="text-xs capitalize mb-3 inline-block">
                      {template.industry.replace("-", " ")}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Pricing */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Pricing Range</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-semibold">
                          ${lowestPrice.toLocaleString()}
                        </span>
                        <span className="text-gray-400">—</span>
                        <span className="text-lg text-gray-600">
                          ${highestPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                      <div>
                        <span className="font-medium text-gray-900">{template.pricingTiers.length}</span> pricing tiers
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{template.deliverables.length}</span> deliverables
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{template.solutionPhases.length}</span> phases
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{template.addOns.length}</span> add-ons
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1 bg-black hover:bg-gray-800 text-white h-9"
                      >
                        Use Template
                      </Button>
                      <Button
                        onClick={() => setPreviewTemplate(template)}
                        variant="outline"
                        className="h-9 border-gray-300"
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-gray-300">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or category filter</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      {/* Preview Dialog */}
      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Badge variant="secondary" className="text-xs capitalize mb-2">
                    {previewTemplate.industry.replace("-", " ")}
                  </Badge>
                  <DialogTitle className="text-2xl">{previewTemplate.name}</DialogTitle>
                  <DialogDescription className="text-base mt-2">
                    {previewTemplate.description}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Problems */}
              <div>
                <h3 className="font-semibold mb-3">Problems Addressed</h3>
                <ul className="space-y-2">
                  {previewTemplate.problems.map((problem: any, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>{problem.title || problem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solution Phases */}
              <div>
                <h3 className="font-semibold mb-3">Solution Phases</h3>
                <div className="space-y-3">
                  {previewTemplate.solutionPhases.map((phase: any, idx: number) => (
                    <div key={idx} className="border border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium">{phase.title}</p>
                        <span className="text-xs text-gray-500">{phase.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600">{phase.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <h3 className="font-semibold mb-3">Deliverables</h3>
                <ul className="space-y-1">
                  {previewTemplate.deliverables.map((deliverable: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing Tiers */}
              <div>
                <h3 className="font-semibold mb-3">Pricing Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {previewTemplate.pricingTiers.map((tier: any, idx: number) => (
                    <div key={idx} className="border border-gray-200 p-4">
                      <p className="font-medium mb-1">{tier.name}</p>
                      <p className="text-2xl font-semibold mb-2">${tier.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">{tier.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t">
                <Button
                  onClick={() => {
                    setPreviewTemplate(null);
                    handleUseTemplate(previewTemplate);
                  }}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  Use This Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Customize Dialog */}
      {selectedTemplate && (
        <CustomizeTemplateDialog
          template={selectedTemplate}
          open={customizeDialogOpen}
          onOpenChange={(open) => {
            setCustomizeDialogOpen(open);
            if (!open) setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}

