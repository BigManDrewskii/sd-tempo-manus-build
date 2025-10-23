import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, ArrowLeft, Save, Download, Palette } from "lucide-react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useEffect, useState, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function EditProposal() {
  // Try both route patterns
  const [matchEdit, paramsEdit] = useRoute("/edit/:id");
  const [matchProposal, paramsProposal] = useRoute("/proposal/:id/edit");
  
  const params = matchEdit ? paramsEdit : paramsProposal;
  const proposalId = params?.id ? parseInt(params.id) : null;
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch proposal data
  const { data: proposal, isLoading } = trpc.proposals.get.useQuery(
    { id: proposalId || 0 },
    { enabled: !!proposalId && proposalId > 0 }
  );

  // Form state
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [problems, setProblems] = useState<Array<{ title: string; description: string; icon: string }>>([]);
  const [phases, setPhases] = useState<Array<{ title: string; duration: string }>>([]);
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [pricingTiers, setPricingTiers] = useState<Array<{ name: string; price: number; features: string[]; recommended?: boolean }>>([]);
  const [addOns, setAddOns] = useState<Array<{ id: string; name: string; price: number; description: string }>>([]);
  const [theme, setTheme] = useState<"default" | "modern" | "classic" | "bold" | "minimal" | "elegant">("default");
  
  // Track if form has unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialDataRef = useRef<string | null>(null);

  // Populate form when proposal loads
  useEffect(() => {
    if (proposal) {
      setClientName(proposal.clientName);
      setProjectName(proposal.projectName);
      setValidUntil(new Date(proposal.validUntil).toISOString().split("T")[0]);
      setProblems(proposal.problems);
      setPhases(proposal.solutionPhases);
      setDeliverables(proposal.deliverables);
      setPricingTiers(proposal.pricingTiers);
      setAddOns(proposal.addOns);
      setTheme(proposal.theme || "default");
      
      // Store initial data for comparison
      initialDataRef.current = JSON.stringify({
        clientName: proposal.clientName,
        projectName: proposal.projectName,
        validUntil: new Date(proposal.validUntil).toISOString().split("T")[0],
        problems: proposal.problems,
        phases: proposal.solutionPhases,
        deliverables: proposal.deliverables,
        pricingTiers: proposal.pricingTiers,
        addOns: proposal.addOns,
        theme: proposal.theme || "default"
      });
    }
  }, [proposal]);
  
  // Track changes to form data
  useEffect(() => {
    if (!initialDataRef.current) return;
    
    const currentData = JSON.stringify({
      clientName,
      projectName,
      validUntil,
      problems,
      phases,
      deliverables,
      pricingTiers,
      addOns,
      theme
    });
    
    setHasUnsavedChanges(currentData !== initialDataRef.current);
  }, [clientName, projectName, validUntil, problems, phases, deliverables, pricingTiers, addOns, theme]);
  
  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Mutations
  const exportMutation = trpc.proposals.exportPDF.useMutation();
  
  // Update mutation
  const updateMutation = trpc.proposals.update.useMutation({
    onSuccess: () => {
      toast.success("Proposal saved successfully");
      setHasUnsavedChanges(false);
      window.history.back();
    },
    onError: (error) => {
      toast.error(`Failed to update proposal: ${error.message}`);
    },
  });

  const handleExportPDF = async () => {
    if (!proposalId) return;
    
    try {
      const result = await exportMutation.mutateAsync({ id: proposalId });
      
      // Convert base64 to blob and download
      const byteCharacters = atob(result.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault();
    
    if (!proposalId) return;

    updateMutation.mutate({
      id: proposalId,
      data: {
        clientName,
        projectName,
        validUntil: new Date(validUntil),
        status,
        theme,
        problems,
        solutionPhases: phases,
        deliverables,
        pricingTiers,
        addOns,
      },
    });
  };

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card>
          <CardHeader>
            <CardTitle>Proposal Not Found</CardTitle>
            <CardDescription>The proposal you're looking for doesn't exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                if (hasUnsavedChanges) {
                  if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
                    window.history.back();
                  }
                } else {
                  window.history.back();
                }
              }}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Edit Proposal</h1>
              <p className="text-sm text-gray-500">{proposal.projectName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              disabled={exportMutation.isPending}
              className="gap-2"
            >
              {exportMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={updateMutation.isPending}
            >
              Save as Draft
            </Button>
            <Button
              onClick={(e) => handleSubmit(e, "published")}
              disabled={updateMutation.isPending}
              className="bg-black hover:bg-gray-800 text-white gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save & Publish
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumb items={[
          { label: proposal?.projectName || 'Proposal', href: `/proposal/${proposalId}` },
          { label: 'Edit' }
        ]} />
        <form className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-black" />
                <CardTitle>Proposal Theme</CardTitle>
              </div>
              <CardDescription>
                Choose a visual theme for your proposal. This only affects how the proposal looks to clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeSelector selectedTheme={theme} onThemeChange={setTheme} />
            </CardContent>
          </Card>

          {/* Problems */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Client Problems</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setProblems([...problems, { title: "", description: "", icon: "AlertCircle" }])}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Problem
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {problems.map((problem, index) => (
                <div key={index} className="p-4 md:p-5 border border-gray-200 rounded-lg space-y-3 bg-white">
                  <div className="flex justify-between items-start">
                    <Label className="text-sm font-medium">Problem {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setProblems(problems.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Problem title"
                    value={problem.title}
                    onChange={(e) => {
                      const newProblems = [...problems];
                      newProblems[index].title = e.target.value;
                      setProblems(newProblems);
                    }}
                  />
                  <Textarea
                    placeholder="Problem description"
                    value={problem.description}
                    onChange={(e) => {
                      const newProblems = [...problems];
                      newProblems[index].description = e.target.value;
                      setProblems(newProblems);
                    }}
                    rows={3}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Solution Phases */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Solution Timeline</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPhases([...phases, { title: "", duration: "" }])}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Phase
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {phases.map((phase, index) => (
                <div key={index} className="p-4 md:p-5 border border-gray-200 rounded-lg space-y-3 bg-white">
                  <div className="flex justify-between items-start">
                    <Label className="text-sm font-medium">Phase {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPhases(phases.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Phase title"
                      value={phase.title}
                      onChange={(e) => {
                        const newPhases = [...phases];
                        newPhases[index].title = e.target.value;
                        setPhases(newPhases);
                      }}
                    />
                    <Input
                      placeholder="Duration (e.g., 2 Weeks)"
                      value={phase.duration}
                      onChange={(e) => {
                        const newPhases = [...phases];
                        newPhases[index].duration = e.target.value;
                        setPhases(newPhases);
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Deliverables</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDeliverables([...deliverables, ""])}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Deliverable
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {deliverables.map((deliverable, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Deliverable description"
                    value={deliverable}
                    onChange={(e) => {
                      const newDeliverables = [...deliverables];
                      newDeliverables[index] = e.target.value;
                      setDeliverables(newDeliverables);
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeliverables(deliverables.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing Tiers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pricing Tiers</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPricingTiers([...pricingTiers, { name: "", price: 0, features: [], recommended: false }])}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Tier
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pricingTiers.map((tier, index) => (
                <div key={index} className="p-4 md:p-5 border border-gray-200 rounded-lg space-y-3 bg-white">
                  <div className="flex justify-between items-start">
                    <Label className="text-sm font-medium">Tier {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPricingTiers(pricingTiers.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Tier name"
                      value={tier.name}
                      onChange={(e) => {
                        const newTiers = [...pricingTiers];
                        newTiers[index].name = e.target.value;
                        setPricingTiers(newTiers);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={tier.price}
                      onChange={(e) => {
                        const newTiers = [...pricingTiers];
                        newTiers[index].price = parseFloat(e.target.value);
                        setPricingTiers(newTiers);
                      }}
                    />
                  </div>
                  <Textarea
                    placeholder="Features (one per line)"
                    value={tier.features.join("\n")}
                    onChange={(e) => {
                      const newTiers = [...pricingTiers];
                      newTiers[index].features = e.target.value.split("\n").filter(f => f.trim());
                      setPricingTiers(newTiers);
                    }}
                    rows={4}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={tier.recommended || false}
                      onChange={(e) => {
                        const newTiers = [...pricingTiers];
                        newTiers[index].recommended = e.target.checked;
                        setPricingTiers(newTiers);
                      }}
                      className="rounded"
                    />
                    Mark as recommended
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Optional Add-ons</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddOns([...addOns, { id: `addon-${Date.now()}`, name: "", price: 0, description: "" }])}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Add-on
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {addOns.map((addon, index) => (
                <div key={index} className="p-4 md:p-5 border border-gray-200 rounded-lg space-y-3 bg-white">
                  <div className="flex justify-between items-start">
                    <Label className="text-sm font-medium">Add-on {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddOns(addOns.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Add-on name"
                      value={addon.name}
                      onChange={(e) => {
                        const newAddOns = [...addOns];
                        newAddOns[index].name = e.target.value;
                        setAddOns(newAddOns);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={addon.price}
                      onChange={(e) => {
                        const newAddOns = [...addOns];
                        newAddOns[index].price = parseFloat(e.target.value);
                        setAddOns(newAddOns);
                      }}
                    />
                  </div>
                  <Textarea
                    placeholder="Add-on description"
                    value={addon.description}
                    onChange={(e) => {
                      const newAddOns = [...addOns];
                      newAddOns[index].description = e.target.value;
                      setAddOns(newAddOns);
                    }}
                    rows={2}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

