import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Sparkles, ArrowLeft, Briefcase, Code, TrendingUp, Megaphone, Smartphone, ShoppingCart } from "lucide-react";

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

export default function Templates() {
  const { user, isAuthenticated } = useAuth();
  const { data: templates, isLoading } = trpc.templates.list.useQuery();

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
            <a className="flex items-center gap-2 text-2xl font-bold text-[#644a40]">
              <img src={APP_LOGO} alt="Tempo" className="w-8 h-8" />
              Tempo
            </a>
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
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#644a40]/10 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-[#644a40]" />
          <span className="text-sm font-medium text-[#644a40]">Template Library</span>
        </div>
        <h1 className="text-5xl font-bold mb-6">
          Start with a <span className="text-[#644a40]">Professional Template</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose from industry-specific templates crafted by experts. Customize and send in minutes.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates?.map((template) => {
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
                  <Link href={`/templates/${template.id}/preview`}>
                    <Button variant="outline" className="flex-1">
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/templates/${template.id}/customize`}>
                    <Button className="flex-1 bg-[#644a40] hover:bg-[#4a3530]">
                      Use Template
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {templates?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No templates available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

