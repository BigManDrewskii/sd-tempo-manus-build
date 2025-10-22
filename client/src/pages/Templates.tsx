import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Sparkles, ArrowLeft, Briefcase, Code, TrendingUp, Megaphone, Smartphone, ShoppingCart, Search, CheckCircle } from "lucide-react";
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#644a40] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

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
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#644a40]/10 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-[#644a40]" />
          <span className="text-sm font-medium text-[#644a40]">Template Library</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
          Start with a <span className="text-[#644a40]">Professional Template</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Choose from industry-specific templates crafted by experts. Customize and send in minutes.
        </p>

        {/* Search and Filters */}
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
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto px-4 md:px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredTemplates?.map((template) => {
            const Icon = industryIcons[template.industry];
            const colorClass = industryColors[template.industry];
            const lowestPrice = Math.min(...template.pricingTiers.map(t => t.price));
            const highestPrice = Math.max(...template.pricingTiers.map(t => t.price));

            return (
              <Card key={template.id} className="hover:shadow-xl transition-shadow duration-300 border-2">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {template.industry.replace("-", " ")}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{template.name}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Includes:</p>
                      <ul className="space-y-1">
                        <li className="text-sm text-gray-600">• {template.problems.length} client problems identified</li>
                        <li className="text-sm text-gray-600">• {template.solutionPhases.length}-phase project timeline</li>
                        <li className="text-sm text-gray-600">• {template.deliverables.length} deliverables</li>
                        <li className="text-sm text-gray-600">• {template.pricingTiers.length} pricing tiers</li>
                        <li className="text-sm text-gray-600">• {template.addOns.length} optional add-ons</li>
                      </ul>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-2xl font-bold text-[#644a40]">
                        ${lowestPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">Up to ${highestPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    Preview
                  </Button>
                  <Button
                    className="flex-1 bg-[#644a40] hover:bg-[#4a3530]"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setCustomizeDialogOpen(true);
                    }}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredTemplates?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {searchQuery || selectedCategory !== "all"
                ? "No templates match your search"
                : "No templates available yet."}
            </p>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && !customizeDialogOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTemplate(null)}
        >
          <Card
            className="max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="capitalize mb-2">
                    {selectedTemplate.industry.replace("-", " ")}
                  </Badge>
                  <CardTitle className="text-2xl md:text-3xl mb-2">{selectedTemplate.name}</CardTitle>
                  <CardDescription className="text-base">{selectedTemplate.description}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Problems Preview */}
              {selectedTemplate.problems && selectedTemplate.problems.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Client Problems Addressed</h3>
                  <div className="grid gap-3">
                    {selectedTemplate.problems.map((problem: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{problem.title}</div>
                          <div className="text-sm text-muted-foreground">{problem.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Tiers Preview */}
              {selectedTemplate.pricingTiers && selectedTemplate.pricingTiers.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Pricing Tiers</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {selectedTemplate.pricingTiers.map((tier: any, index: number) => (
                      <div key={index} className="border-2 rounded-lg p-4 text-center hover:border-primary transition-colors">
                        {tier.recommended && (
                          <Badge className="mb-2">Recommended</Badge>
                        )}
                        <div className="font-semibold text-lg">{tier.name}</div>
                        <div className="text-3xl font-bold text-primary my-2">
                          ${tier.price.toLocaleString()}
                        </div>
                        <ul className="text-sm text-left space-y-1 mt-3">
                          {tier.features.slice(0, 3).map((feature: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons Preview */}
              {selectedTemplate.addOns && selectedTemplate.addOns.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Optional Add-ons</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedTemplate.addOns.map((addon: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{addon.name}</div>
                          <div className="text-xs text-muted-foreground">{addon.description}</div>
                        </div>
                        <span className="font-semibold text-primary">+${addon.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                onClick={() => setCustomizeDialogOpen(true)}
              >
                Use This Template
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Customization Dialog */}
      {selectedTemplate && customizeDialogOpen && (
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

