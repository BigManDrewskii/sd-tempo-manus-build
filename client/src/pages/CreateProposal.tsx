import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function CreateProposal() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const createMutation = trpc.proposals.create.useMutation();

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const handleQuickStart = () => {
    // Pre-fill with sample data from specs
    setTitle("Website Redesign & Development Proposal");
    setClientName("Acme Corp");
    setProjectName("Website Redesign & Development");
    
    // Set valid until date to 30 days from now
    const date = new Date();
    date.setDate(date.getDate() + 30);
    setValidUntil(date.toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        title,
        clientName,
        projectName,
        validUntil: new Date(validUntil),
        problems: [
          {
            title: "Outdated Design",
            description: "Website built in 2018, no longer reflects modern standards",
            icon: "AlertCircle"
          },
          {
            title: "Slow Performance",
            description: "Average load time of 3.2 seconds affecting user experience",
            icon: "TrendingDown"
          },
          {
            title: "Poor Mobile Experience",
            description: "68% bounce rate on mobile devices",
            icon: "Users"
          },
          {
            title: "No Analytics Integration",
            description: "Unable to track user behavior and conversions",
            icon: "Clock"
          }
        ],
        solutionPhases: [
          { title: "Discovery & Research", duration: "2 weeks" },
          { title: "Design & Prototyping", duration: "4 weeks" },
          { title: "Development & Testing", duration: "6 weeks" },
          { title: "Launch & Training", duration: "2 weeks" }
        ],
        deliverables: [
          "Modern responsive design",
          "Performance optimization",
          "SEO implementation",
          "CMS integration",
          "3 months post-launch support",
          "Training documentation"
        ],
        caseStudies: [
          {
            title: "E-commerce Platform Redesign",
            description: "Complete overhaul of online shopping experience",
            metrics: [
              { label: "Conversion Rate", value: "+45%" },
              { label: "Page Speed", value: "0.8s" },
              { label: "Revenue Growth", value: "+120%" },
              { label: "Customer Satisfaction", value: "4.8/5" }
            ]
          },
          {
            title: "SaaS Dashboard Rebuild",
            description: "Modern analytics platform for B2B clients",
            metrics: [
              { label: "User Engagement", value: "+85%" },
              { label: "Load Time", value: "1.2s" },
              { label: "Feature Adoption", value: "+60%" },
              { label: "Churn Reduction", value: "-35%" }
            ]
          }
        ],
        pricingTiers: [
          {
            name: "Starter",
            price: 12000,
            features: [
              "5-page responsive website",
              "Basic SEO setup",
              "Mobile optimization",
              "1 month support"
            ]
          },
          {
            name: "Pro",
            price: 24000,
            features: [
              "10-page responsive website",
              "Advanced SEO & analytics",
              "CMS integration",
              "Performance optimization",
              "3 months support",
              "Training sessions"
            ],
            recommended: true
          },
          {
            name: "Enterprise",
            price: 45000,
            features: [
              "Unlimited pages",
              "Custom functionality",
              "Advanced integrations",
              "Priority support",
              "6 months support",
              "Dedicated account manager"
            ]
          }
        ],
        addOns: [
          {
            id: "rush",
            name: "Rush Delivery",
            price: 5000,
            description: "Expedited timeline with 50% faster delivery"
          },
          {
            id: "support",
            name: "Extended Support",
            price: 500,
            description: "Additional 3 months of priority support"
          },
          {
            id: "training",
            name: "Team Training",
            price: 2000,
            description: "On-site training for your team (2 days)"
          }
        ]
      });

      setLocation(`/proposal/${result.id}`);
    } catch (error) {
      console.error("Error creating proposal:", error);
      alert("Failed to create proposal. Please try again.");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <FileText className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">Tempo</span>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Proposal</h1>
          <p className="text-muted-foreground">
            Fill in the basic details to generate an interactive proposal.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Proposal Details</CardTitle>
            <CardDescription>
              Start with the essentials. You can customize content after creation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Proposal Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Website Redesign & Development Proposal"
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Acme Corp"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Website Redesign & Development"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  required
                  className="mt-1"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleQuickStart}
                  className="mb-4"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Quick Start with Sample Data
                </Button>
                <p className="text-sm text-muted-foreground mb-4">
                  This will create a proposal with pre-filled sections including problems, solutions, 
                  pricing tiers, and case studies. Perfect for getting started quickly.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Proposal"
                  )}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline" size="lg">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">What's Included</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Interactive pricing calculator with real-time totals</li>
              <li>• Digital signature pad for instant acceptance</li>
              <li>• Scroll progress tracking and engagement analytics</li>
              <li>• Beautiful, responsive design that works on all devices</li>
              <li>• Shareable link that can be sent to clients</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

