import { useEffect, useState, useRef, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { 
  AlertCircle, 
  TrendingDown, 
  Users, 
  Clock, 
  CheckCircle, 
  ChevronDown,
  Loader2,
  ArrowLeft,
  Download,
  Mail
} from "lucide-react";
import { format } from "date-fns";
import { getTheme } from "@shared/themes";
import { SendProposalDialog } from "@/components/SendProposalDialog";

// Generate session ID for tracking
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("tempo_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("tempo_session_id", sessionId);
  }
  return sessionId;
};

export default function ViewProposal() {
  const [, params] = useRoute("/proposal/:id");
  const proposalId = params?.id ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const { data: proposal, isLoading } = trpc.proposals.get.useQuery({ id: proposalId });
  const theme = proposal ? getTheme(proposal.theme || "default") : getTheme("default");
  const { data: signature } = trpc.signatures.get.useQuery({ proposalId });
  
  const trackViewMutation = trpc.tracking.trackView.useMutation();
  const trackEventMutation = trpc.tracking.trackEvent.useMutation();
  const submitSignatureMutation = trpc.signatures.submit.useMutation();
  const exportMutation = trpc.proposals.exportPDF.useMutation();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionsViewed, setSectionsViewed] = useState<Set<string>>(new Set());
  const [timeSpent, setTimeSpent] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(true);
  
  // Pricing state
  const [selectedTier, setSelectedTier] = useState("pro");
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  
  // Signature state
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const sessionId = useMemo(() => getSessionId(), []);
  const startTimeRef = useRef(Date.now());
  
  // Get tracking token from URL if present
  const trackingToken = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('t');
  }, []);

  // Track view on mount
  useEffect(() => {
    if (proposalId) {
      trackViewMutation.mutate({
        proposalId,
        sessionId,
      });
    }
    
    // Track email view if tracking token present
    if (trackingToken) {
      fetch(`/api/track/view/${trackingToken}`, {
        method: 'POST',
      }).catch(err => console.error('Failed to track email view:', err));
    }
  }, [proposalId, sessionId, trackingToken]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = (scrollTop / trackLength) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Time spent tracking
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeSpent(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  // Email time tracking - send updates every 30 seconds
  useEffect(() => {
    if (!trackingToken) return;
    
    let lastSentTime = 0;
    const trackTime = () => {
      const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const timeSpent = currentTime - lastSentTime;
      
      if (timeSpent > 0) {
        fetch(`/api/track/time/${trackingToken}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeSpent }),
        }).catch(err => console.error('Failed to track time:', err));
        
        lastSentTime = currentTime;
      }
    };
    
    // Track every 30 seconds
    const interval = setInterval(trackTime, 30000);
    
    // Track on page unload
    const handleUnload = () => {
      trackTime();
    };
    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      trackTime(); // Final update
    };
  }, [trackingToken]);

  // Section visibility tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setSectionsViewed((prev) => {
              const newSet = new Set(prev);
              if (!newSet.has(entry.target.id)) {
                newSet.add(entry.target.id);
                trackEventMutation.mutate({
                  proposalId,
                  sessionId,
                  eventType: "section_viewed",
                  eventData: { sectionId: entry.target.id },
                });
              }
              return newSet;
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [proposalId, sessionId]);

  // Canvas signature setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (!sectionsViewed.has("signature")) {
      trackEventMutation.mutate({
        proposalId,
        sessionId,
        eventType: "signature_started",
      });
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleTierChange = (tier: string) => {
    setSelectedTier(tier);
    trackEventMutation.mutate({
      proposalId,
      sessionId,
      eventType: "pricing_changed",
      eventData: { selectedTier: tier },
    });
  };

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(addOnId)) {
        newSet.delete(addOnId);
      } else {
        newSet.add(addOnId);
      }
      
      trackEventMutation.mutate({
        proposalId,
        sessionId,
        eventType: "addon_toggled",
        eventData: { addOnId, enabled: !prev.has(addOnId) },
      });
      
      return newSet;
    });
  };

  const calculateTotal = () => {
    if (!proposal) return 0;
    
    const tier = proposal.pricingTiers.find((t) => t.name.toLowerCase() === selectedTier.toLowerCase());
    const tierPrice = tier?.price || 0;
    
    const addOnsPrice = Array.from(selectedAddOns).reduce((sum, addOnId) => {
      const addOn = proposal.addOns.find((a) => a.id === addOnId);
      return sum + (addOn?.price || 0);
    }, 0);
    
    return tierPrice + addOnsPrice;
  };

  const handleSubmitSignature = async () => {
    if (!proposal || !hasSignature || !signerName || !signerEmail) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSubmitting(true);

    try {
      const signatureData = canvas.toDataURL("image/png");
      
      await submitSignatureMutation.mutateAsync({
        proposalId,
        signerName,
        signerEmail,
        signatureData,
        selectedTier,
        selectedAddOns: Array.from(selectedAddOns),
        totalPrice: Math.round(calculateTotal() * 100), // Convert to cents
      });

      alert("Proposal signed successfully!");
    } catch (error) {
      console.error("Error submitting signature:", error);
      alert("Failed to submit signature. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleExportPDF = async () => {
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
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const calculateEngagementScore = () => {
    const totalSections = 6;
    const viewedCount = sectionsViewed.size;
    const timeScore = Math.min(timeSpent / 180, 1); // Max at 3 minutes
    const interactionScore = (selectedAddOns.size > 0 || hasSignature) ? 0.2 : 0;
    
    return Math.round(((viewedCount / totalSections) * 0.6 + timeScore * 0.2 + interactionScore) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Proposal Not Found</h1>
          <p className="text-muted-foreground">The proposal you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isExpired = new Date(proposal.validUntil) < new Date();
  const isSigned = !!signature;

  return (
    <div data-theme={proposal.theme || 'default'} className="min-h-screen bg-background">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Card className="w-64 shadow-lg border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                Engagement
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowAnalytics(false)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Spent:</span>
                <span className="font-medium">{formatTime(timeSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sections:</span>
                <span className="font-medium">{sectionsViewed.size}/6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Score:</span>
                <span className="font-medium text-primary">{calculateEngagementScore()}%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      {user && (
        <div className="fixed top-20 left-6 z-40 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSendDialogOpen(true)}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send to Client
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={exportMutation.isPending}
            className="bg-background/80 backdrop-blur-sm"
          >
            {exportMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export PDF
          </Button>
        </div>
      )}

      {/* Send Proposal Dialog */}
      {user && proposal && (
        <SendProposalDialog
          open={sendDialogOpen}
          onOpenChange={setSendDialogOpen}
          proposalId={proposalId}
          proposalTitle={proposal.title}
          clientName={proposal.clientName}
        />
      )}

      {/* Hero Section */}
      <section
        id="hero"
        data-section
        className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-primary to-secondary text-accent"
      >
        <div className="container text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-4">{proposal.projectName}</h1>
            <p className="text-2xl mb-2">Proposal for {proposal.clientName}</p>
            <p className="text-lg opacity-90">
              {format(new Date(), "MMMM d, yyyy")} • Valid until {format(new Date(proposal.validUntil), "MMMM d, yyyy")}
            </p>
            
            {isSigned && (
              <Badge className="mt-4 bg-green-500 text-white">
                <CheckCircle className="w-4 h-4 mr-1" />
                Signed
              </Badge>
            )}
            {isExpired && !isSigned && (
              <Badge variant="destructive" className="mt-4">
                Expired
              </Badge>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-12"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </div>
      </section>

      {/* Problems Section */}
      <section id="problems" data-section className="py-20 px-6">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-center mb-12">The Challenge</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {proposal.problems.map((problem, index) => {
                const Icon = problem.icon === "AlertCircle" ? AlertCircle :
                           problem.icon === "TrendingDown" ? TrendingDown :
                           problem.icon === "Users" ? Users : Clock;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-destructive" />
                        </div>
                        <CardTitle>{problem.title}</CardTitle>
                        <CardDescription>{problem.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" data-section className="py-20 px-6 bg-card/50">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-center mb-12">Our Solution</h2>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Timeline */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">Project Timeline</h3>
                <div className="space-y-4">
                  {proposal.solutionPhases.map((phase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{phase.title}</h4>
                        <p className="text-sm text-muted-foreground">{phase.duration}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">Deliverables</h3>
                <div className="space-y-3">
                  {proposal.deliverables.map((deliverable, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{deliverable}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" data-section className="py-20 px-6">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-center mb-12">Investment Options</h2>
            
            {/* Pricing Tiers */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {proposal.pricingTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => handleTierChange(tier.name.toLowerCase())}
                >
                  <Card className={`h-full transition-all ${
                    selectedTier === tier.name.toLowerCase()
                      ? "border-primary shadow-lg ring-2 ring-primary"
                      : "hover:border-primary/50"
                  } ${tier.recommended ? "border-primary" : ""}`}>
                    <CardHeader>
                      {tier.recommended && (
                        <Badge className="w-fit mb-2">Recommended</Badge>
                      )}
                      <CardTitle className="text-2xl">{tier.name}</CardTitle>
                      <div className="text-4xl font-bold text-primary">
                        ${tier.price.toLocaleString()}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Add-ons */}
            {proposal.addOns.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-6">Optional Add-ons</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {proposal.addOns.map((addOn) => (
                    <Card key={addOn.id} className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleAddOnToggle(addOn.id)}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <Checkbox
                          checked={selectedAddOns.has(addOn.id)}
                          onCheckedChange={() => handleAddOnToggle(addOn.id)}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold">{addOn.name}</h4>
                            <span className="font-semibold text-primary">
                              +${addOn.price.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{addOn.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-lg opacity-90">Total Investment</p>
                  <p className="text-sm opacity-75">
                    {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} tier
                    {selectedAddOns.size > 0 && ` + ${selectedAddOns.size} add-on${selectedAddOns.size > 1 ? 's' : ''}`}
                  </p>
                </div>
                <motion.div
                  key={calculateTotal()}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-bold"
                >
                  ${calculateTotal().toLocaleString()}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Section */}
      {proposal.caseStudies.length > 0 && (
        <section id="case-studies" data-section className="py-20 px-6 bg-card/50">
          <div className="container max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-center mb-12">Proven Results</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {proposal.caseStudies.map((study, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all">
                      <CardHeader>
                        <CardTitle>{study.title}</CardTitle>
                        <CardDescription>{study.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {study.metrics.map((metric, i) => (
                            <div key={i} className="text-center p-4 rounded-lg bg-primary/5">
                              <div className="text-3xl font-bold text-primary">{metric.value}</div>
                              <div className="text-sm text-muted-foreground">{metric.label}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Signature Section */}
      {!isSigned && !isExpired && (
        <section id="signature" data-section className="py-20 px-6">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-center mb-12">Accept & Sign</h2>
              
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={signerName}
                        onChange={(e) => {
                          setSignerName(e.target.value);
                          if (e.target.value) {
                            trackEventMutation.mutate({
                              proposalId,
                              sessionId,
                              eventType: "form_filled",
                              eventData: { field: "name" },
                            });
                          }
                        }}
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={signerEmail}
                        onChange={(e) => {
                          setSignerEmail(e.target.value);
                          if (e.target.value) {
                            trackEventMutation.mutate({
                              proposalId,
                              sessionId,
                              eventType: "form_filled",
                              eventData: { field: "email" },
                            });
                          }
                        }}
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Signature *</Label>
                    <div className="mt-2 border-2 border-border rounded-lg overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={800}
                        height={200}
                        className="w-full bg-white cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSignature}
                        disabled={!hasSignature}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="font-semibold mb-4">Next Steps</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li>1. We'll send you a confirmation email within 24 hours</li>
                      <li>2. Project kickoff call scheduled within 3 business days</li>
                      <li>3. Initial deliverables within the timeline specified above</li>
                    </ol>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    disabled={!signerName || !signerEmail || !hasSignature || isSubmitting}
                    onClick={handleSubmitSignature}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Accept & Sign Proposal"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Signed Confirmation */}
      {isSigned && signature && (
        <section id="signed" data-section className="py-20 px-6">
          <div className="container max-w-4xl">
            <Card className="border-green-500">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Proposal Signed!</h2>
                <p className="text-muted-foreground mb-4">
                  Signed by {signature.signerName} on {format(new Date(signature.signedAt), "MMMM d, yyyy 'at' h:mm a")}
                </p>
                <div className="inline-block p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Investment</p>
                  <p className="text-3xl font-bold text-primary">
                    ${(signature.totalPrice / 100).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}

