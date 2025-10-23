import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { FileText, Loader2, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function CreateProposalAI() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const generateMutation = (trpc.proposals as any).generateWithAI.useMutation();
  const createMutation = trpc.proposals.create.useMutation();

  const [step, setStep] = useState<"input" | "generating" | "preview">("input");
  const [generatedData, setGeneratedData] = useState<any>(null);

  // Form state
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [industry, setIndustry] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [budgetRange, setBudgetRange] = useState<"low" | "medium" | "high">("medium");
  const [timeline, setTimeline] = useState<"urgent" | "normal" | "extended">("normal");
  const [serviceType, setServiceType] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted - starting AI generation");

    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      window.location.href = getLoginUrl();
      return;
    }
    
    // Form validation
    if (!clientName.trim()) {
      toast.error("Client name is required");
      return;
    }
    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }
    if (!industry) {
      toast.error("Please select an industry");
      return;
    }
    if (!projectDescription.trim() || projectDescription.length < 20) {
      toast.error("Project description must be at least 20 characters");
      return;
    }
    if (!serviceType) {
      toast.error("Please select a service type");
      return;
    }
    if (!validUntil) {
      toast.error("Please set a valid until date");
      return;
    }

    console.log("Setting step to generating");
    setStep("generating");

    try {
      console.log("Calling generateMutation with data:", {
        clientName,
        projectName,
        industry,
        projectDescription: projectDescription.substring(0, 50) + "...",
        budgetRange,
        timeline,
        serviceType,
      });
      
      const result = await generateMutation.mutateAsync({
        clientName,
        projectName,
        industry,
        projectDescription,
        budgetRange,
        timeline,
        serviceType,
      });

      console.log("Generation successful, result:", result);
      setGeneratedData(result);
      setStep("preview");
    } catch (error: any) {
      console.error("Error generating proposal:", error);
      console.error("Error details:", error.message, error.data);
      toast.error("Failed to generate proposal", {
        description: error.message || "Please try again later",
      });
      setStep("input");
    }
  };

  const handleCreateProposal = async () => {
    if (!generatedData) return;

    try {
      const result = await createMutation.mutateAsync({
        title: `${projectName} Proposal`,
        clientName: generatedData.clientName,
        projectName: generatedData.projectName,
        validUntil: new Date(validUntil),
        problems: generatedData.problems,
        solutionPhases: generatedData.solutionPhases,
        deliverables: generatedData.deliverables,
        caseStudies: generatedData.caseStudies,
        pricingTiers: generatedData.pricingTiers,
        addOns: generatedData.addOns,
      });

      setLocation(`/proposal/${result.id}/edit`);
    } catch (error) {
      console.error("Error creating proposal:", error);
      alert("Failed to create proposal. Please try again.");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-16">
        {step === "input" && (
          <>
            <div className="mb-8 md:mb-10 lg:mb-12">
              <div className="flex items-start gap-3 md:gap-4 mb-2 md:mb-3">
                <div className="p-2 md:p-3 bg-black rounded-lg flex-shrink-0">
                  <Wand2 className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black leading-tight">AI-Powered Proposal</h1>
              </div>
              <p className="text-sm md:text-base lg:text-lg text-gray-600 md:ml-[60px] lg:ml-[68px]">
                Describe your project and let AI generate a complete, professional proposal in seconds.
              </p>
            </div>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-200 pb-6">
                <CardTitle className="text-2xl font-bold text-black">Project Details</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  Provide information about your project and AI will create a tailored proposal.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleGenerate} className="space-y-8">
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
                        placeholder="Website Redesign"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">Industry *</Label>
                      <Input
                        id="industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="E-commerce, SaaS, Healthcare, etc."
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Input
                        id="serviceType"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        placeholder="Web Development, Design, Consulting, etc."
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="projectDescription">Project Description *</Label>
                    <Textarea
                      id="projectDescription"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe what the client needs, their main challenges, and what success looks like..."
                      required
                      className="mt-1 min-h-32"
                      minLength={10}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Be specific about the client's needs and goals. More detail = better proposal.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="budgetRange">Budget Range *</Label>
                      <Select value={budgetRange} onValueChange={(v: any) => setBudgetRange(v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low ($5k - $15k)</SelectItem>
                          <SelectItem value="medium">Medium ($15k - $50k)</SelectItem>
                          <SelectItem value="high">High ($50k - $150k)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timeline">Timeline *</Label>
                      <Select value={timeline} onValueChange={(v: any) => setTimeline(v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                          <SelectItem value="normal">Normal (4-8 weeks)</SelectItem>
                          <SelectItem value="extended">Extended (3-6 months)</SelectItem>
                        </SelectContent>
                      </Select>
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
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-gray-100 mt-8">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={generateMutation.isPending}
                      className="flex-1"
                    >
                      {generateMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate with AI
                        </>
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

            <Card className="mt-10 border-gray-200 bg-gray-50">
              <CardContent className="p-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-black">
                  <Sparkles className="w-5 h-5" />
                  What AI Will Generate
                </h3>
                <ul className="space-y-3 text-base text-gray-600">
                  <li>• 3-4 specific client problems with descriptions</li>
                  <li>• 4-5 solution phases with realistic timelines</li>
                  <li>• 6-8 concrete deliverables</li>
                  <li>• 2 relevant case studies with metrics</li>
                  <li>• 3 pricing tiers tailored to your budget range</li>
                  <li>• 3 optional add-ons to increase deal value</li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6">
              <div className="relative">
                <Wand2 className="w-16 h-16 text-black animate-pulse mx-auto" />
                <Sparkles className="w-8 h-8 text-black absolute -top-2 -right-2 animate-bounce" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Generating Your Proposal</h2>
                <p className="text-gray-600">
                  AI is analyzing your project and crafting a professional proposal...
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <p className="animate-pulse">✓ Analyzing project requirements</p>
                <p className="animate-pulse delay-100">✓ Identifying client problems</p>
                <p className="animate-pulse delay-200">✓ Crafting solutions</p>
                <p className="animate-pulse delay-300">✓ Generating pricing</p>
              </div>
            </div>
          </div>
        )}

        {step === "preview" && generatedData && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Review Your Proposal</h1>
              <p className="text-gray-600">
                AI has generated your proposal. Review the content and create when ready.
              </p>
            </div>

            <div className="space-y-6">
              {/* Problems */}
              <Card className="border-gray-200 bg-white">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-bold text-black">Client Problems ({generatedData.problems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedData.problems.map((problem: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-black pl-4">
                      <h3 className="font-semibold">{problem.title}</h3>
                      <p className="text-sm text-gray-600">{problem.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Solution Phases */}
              <Card className="border-gray-200 bg-white">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-bold text-black">Solution Timeline ({generatedData.solutionPhases.length} phases)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generatedData.solutionPhases.map((phase: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-medium">{phase.title}</span>
                      <span className="text-sm text-gray-600">{phase.duration}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Deliverables */}
              <Card className="border-gray-200 bg-white">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-bold text-black">Deliverables ({generatedData.deliverables.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {generatedData.deliverables.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-black">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Pricing Tiers */}
              <Card className="border-gray-200 bg-white">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-bold text-black">Pricing Tiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {generatedData.pricingTiers.map((tier: any, idx: number) => (
                      <div
                        key={idx}
                        className={`border rounded-lg p-4 ${
                          tier.recommended ? "border-black bg-gray-50" : ""
                        }`}
                      >
                        <h3 className="font-bold text-lg">{tier.name}</h3>
                        <p className="text-3xl font-bold text-black my-2">
                          ${tier.price.toLocaleString()}
                        </p>
                        <ul className="space-y-1 text-sm">
                          {tier.features.slice(0, 3).map((feature: string, fidx: number) => (
                            <li key={fidx}>• {feature}</li>
                          ))}
                          {tier.features.length > 3 && (
                            <li className="text-gray-600">
                              + {tier.features.length - 3} more
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleCreateProposal}
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
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setStep("input");
                    setGeneratedData(null);
                  }}
                >
                  Start Over
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

