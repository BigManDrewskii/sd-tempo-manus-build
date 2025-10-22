import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Sparkles, ArrowLeft, Briefcase, Code, TrendingUp, Megaphone, Smartphone, ShoppingCart, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { CustomizeTemplateDialog } from "@/components/CustomizeTemplateDialog";

const industryIcons = {
  "web-design": Code,
  "consulting": Briefcase,
  "saas": TrendingUp,
  "marketing": Megaphone,
  "mobile-app": Smartphone,
  "ecommerce": ShoppingCart,
};

const industryColors = {
  "web-design": "bg-blue-100 text-blue-700",
  "consulting": "bg-purple-100 text-purple-700",
  "saas": "bg-green-100 text-green-700",
  "marketing": "bg-pink-100 text-pink-700",
  "mobile-app": "bg-orange-100 text-orange-700",
  "ecommerce": "bg-teal-100 text-teal-700",
};

const CATEGORIES = [
  { id: "all", label: "All Templates" },
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
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const filteredTemplates = templates?.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.industry === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredTemplate = filteredTemplates?.[featuredIndex];

  const nextFeatured = () => {
    if (filteredTemplates && featuredIndex < filteredTemplates.length - 1) {
      setFeaturedIndex(featuredIndex + 1);
    }
  };

  const prevFeatured = () => {
    if (featuredIndex > 0) {
      setFeaturedIndex(featuredIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#644a40] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  const FeaturedIcon = featuredTemplate ? industryIcons[featuredTemplate.industry] : null;
  const featuredColorClass = featuredTemplate ? industryColors[featuredTemplate.industry] : "";
  const lowestPrice = featuredTemplate ? Math.min(...featuredTemplate.pricingTiers.map(t => t.price)) : 0;
  const highestPrice = featuredTemplate ? Math.max(...featuredTemplate.pricingTiers.map(t => t.price)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffdfb5]/20 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 text-2xl font-bold text-[#644a40] cursor-pointer">
              <img src={APP_LOGO} alt="Tempo" className="w-8 h-8" />
              Tempo
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-6 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#644a40]/10 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-[#644a40]" />
          <span className="text-sm font-medium text-[#644a40]">Template Library</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Start with a <span className="text-[#644a40]">Professional Template</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Choose from industry-specific templates crafted by experts. Customize and send in minutes.
        </p>
      </div>

      {/* Featured Template Carousel */}
      {featuredTemplate && (
        <div className="container mx-auto px-4 md:px-6 mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Featured Template</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevFeatured}
                  disabled={featuredIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextFeatured}
                  disabled={!filteredTemplates || featuredIndex === filteredTemplates.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Card className="border-2 shadow-2xl">
              <div className="grid md:grid-cols-2">
                {/* Left: Template Info */}
                <CardHeader className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    {FeaturedIcon && (
                      <div className={`p-4 rounded-xl ${featuredColorClass}`}>
                        <FeaturedIcon className="w-8 h-8" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Badge variant="secondary" className="capitalize mb-2">
                        {featuredTemplate.industry.replace("-", " ")}
                      </Badge>
                      <CardTitle className="text-3xl mb-2">{featuredTemplate.name}</CardTitle>
                      <CardDescription className="text-base">
                        {featuredTemplate.description}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="space-y-6 mt-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">What's Included:</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-2xl font-bold text-[#644a40]">{featuredTemplate.pricingTiers.length}</p>
                          <p className="text-xs text-gray-600">Pricing Tiers</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-2xl font-bold text-[#644a40]">{featuredTemplate.deliverables.length}</p>
                          <p className="text-xs text-gray-600">Deliverables</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-2xl font-bold text-[#644a40]">{featuredTemplate.solutionPhases.length}</p>
                          <p className="text-xs text-gray-600">Project Phases</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-2xl font-bold text-[#644a40]">{featuredTemplate.addOns.length}</p>
                          <p className="text-xs text-gray-600">Add-ons</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500 mb-1">Pricing Range</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-[#644a40]">
                          ${lowestPrice.toLocaleString()}
                        </p>
                        <span className="text-gray-400">—</span>
                        <p className="text-xl font-semibold text-gray-600">
                          ${highestPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Right: Actions & Preview */}
                <div className="bg-gradient-to-br from-[#ffdfb5]/20 to-[#644a40]/10 p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold mb-3">Key Problems Addressed:</h3>
                    <ul className="space-y-2 mb-6">
                      {featuredTemplate.problems.slice(0, 3).map((problem: any, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-[#644a40] mt-0.5">•</span>
                          <span>{problem.title || problem}</span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="font-semibold mb-3">Solution Phases:</h3>
                    <div className="space-y-2">
                      {featuredTemplate.solutionPhases.slice(0, 3).map((phase: any, idx: number) => (
                        <div key={idx} className="bg-white/60 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">{phase.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{phase.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-8">
                    <Button
                      size="lg"
                      className="w-full bg-[#644a40] hover:bg-[#4a3530] text-white"
                      onClick={() => {
                        setSelectedTemplate(featuredTemplate);
                        setCustomizeDialogOpen(true);
                      }}
                    >
                      Use This Template
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedTemplate(featuredTemplate)}
                    >
                      Preview Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category.id);
                  setFeaturedIndex(0); // Reset to first template when filtering
                }}
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* All Templates Grid - Compact View */}
      <div className="container mx-auto px-4 md:px-6 pb-20">
        <h2 className="text-2xl font-bold mb-6">All Templates</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTemplates?.map((template) => {
            const Icon = industryIcons[template.industry];
            const colorClass = industryColors[template.industry];
            const lowestPrice = Math.min(...template.pricingTiers.map(t => t.price));

            return (
              <Card 
                key={template.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-[#644a40]/50"
                onClick={() => {
                  setSelectedTemplate(template);
                  setCustomizeDialogOpen(true);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {template.industry.replace("-", " ")}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-baseline gap-1 mb-2">
                    <p className="text-xl font-bold text-[#644a40]">
                      ${lowestPrice.toLocaleString()}
                    </p>
                    <span className="text-xs text-gray-500">starting</span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs text-gray-600">
                    <span>{template.pricingTiers.length} tiers</span>
                    <span>•</span>
                    <span>{template.deliverables.length} deliverables</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTemplates?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedTemplate && !customizeDialogOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTemplate(null)}
        >
          <Card 
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="capitalize mb-2">
                    {selectedTemplate.industry.replace("-", " ")}
                  </Badge>
                  <CardTitle className="text-2xl">{selectedTemplate.name}</CardTitle>
                  <CardDescription className="mt-2">{selectedTemplate.description}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Problems Addressed:</h3>
                <ul className="space-y-1">
                  {selectedTemplate.problems.map((problem: any, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700">• {problem.title || problem}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Solution Phases:</h3>
                <div className="space-y-2">
                  {selectedTemplate.solutionPhases.map((phase: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 rounded p-3">
                      <p className="font-medium">{phase.title}</p>
                      <p className="text-sm text-gray-600">{phase.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{phase.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Deliverables:</h3>
                <ul className="space-y-1">
                  {selectedTemplate.deliverables.map((deliverable: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700">• {deliverable}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedTemplate(null)}
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-[#644a40] hover:bg-[#4a3530]"
                onClick={() => {
                  setCustomizeDialogOpen(true);
                }}
              >
                Use Template
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Customize Dialog */}
      <CustomizeTemplateDialog
        template={selectedTemplate}
        open={customizeDialogOpen}
        onOpenChange={(open) => {
          setCustomizeDialogOpen(open);
          if (!open) setSelectedTemplate(null);
        }}
      />
    </div>
  );
}

