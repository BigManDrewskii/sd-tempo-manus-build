import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO } from "@/const";
import { trpc } from "@/lib/trpc";
import { useRoute, useLocation, Link } from "wouter";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CustomizeTemplate() {
  const [, params] = useRoute("/templates/:id/customize");
  const templateId = params?.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: template, isLoading } = trpc.templates.get.useQuery({ id: templateId });
  const cloneTemplate = trpc.templates.clone.useMutation();

  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [validUntil, setValidUntil] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 2);
    return date.toISOString().split("T")[0];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    try {
      const result = await cloneTemplate.mutateAsync({
        templateId,
        clientName,
        projectName,
        validUntil,
      });
      
      setLocation(`/proposal/${result.proposalId}`);
    } catch (error) {
      console.error("Error creating proposal from template:", error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#644a40] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Template not found</p>
          <Link href="/templates">
            <Button>Back to Templates</Button>
          </Link>
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
          <Link href="/templates">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Templates
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Customize Your Proposal</h1>
          <p className="text-gray-600">Using template: <span className="font-semibold">{template.name}</span></p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Proposal Details</CardTitle>
              <CardDescription>
                Enter your client and project information. All template content will be pre-filled.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Acme Corporation"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Website Redesign"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until *</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#644a40] hover:bg-[#4a3530]"
                  disabled={cloneTemplate.isPending}
                >
                  {cloneTemplate.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Proposal...
                    </>
                  ) : (
                    "Create Proposal from Template"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Template Preview */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
              <CardDescription>
                This template includes professionally crafted content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Client Problems ({template.problems.length})</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {template.problems.map((problem, i) => (
                    <li key={i}>• {problem.title}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Project Timeline ({template.solutionPhases.length} phases)</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {template.solutionPhases.map((phase, i) => (
                    <li key={i}>• {phase.title} ({phase.duration})</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Deliverables ({template.deliverables.length})</h4>
                <p className="text-sm text-gray-600">
                  {template.deliverables.slice(0, 3).join(", ")}
                  {template.deliverables.length > 3 && `, and ${template.deliverables.length - 3} more...`}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Pricing Tiers ({template.pricingTiers.length})</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {template.pricingTiers.map((tier, i) => (
                    <li key={i}>
                      • {tier.name}: ${tier.price.toLocaleString()}
                      {tier.recommended && <span className="text-[#644a40] font-medium"> (Recommended)</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Add-ons ({template.addOns.length})</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {template.addOns.map((addon, i) => (
                    <li key={i}>• {addon.name} (+${addon.price.toLocaleString()})</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  You can edit all content after creating the proposal
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

