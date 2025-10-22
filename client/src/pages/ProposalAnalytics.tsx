import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Eye, 
  Clock, 
  TrendingUp, 
  Users, 
  MousePointerClick,
  ArrowLeft,
  Loader2,
  Mail,
  MailOpen,
  Timer
} from "lucide-react";
import { format } from "date-fns";
import { getLoginUrl } from "@/const";

export default function ProposalAnalytics() {
  const [, params] = useRoute("/analytics/:id");
  const proposalId = params?.id ? parseInt(params.id) : 0;
  const { isAuthenticated, loading: authLoading } = useAuth();

  const { data: proposal, isLoading: proposalLoading } = trpc.proposals.get.useQuery(
    { id: proposalId },
    { enabled: isAuthenticated }
  );
  
  const { data: analytics, isLoading: analyticsLoading } = trpc.proposals.analytics.useQuery(
    { id: proposalId },
    { enabled: isAuthenticated }
  );

  const { data: signature } = trpc.signatures.get.useQuery(
    { proposalId },
    { enabled: isAuthenticated }
  );
  
  const { data: emailStats } = trpc.proposals.getEmailStats.useQuery(
    { proposalId },
    { enabled: isAuthenticated }
  );
  
  const { data: emailActivity } = trpc.proposals.getEmailActivity.useQuery(
    { proposalId },
    { enabled: isAuthenticated }
  );

  if (authLoading || proposalLoading || analyticsLoading) {
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

  const totalViews = analytics?.views.totalViews || 0;
  const uniqueSessions = analytics?.views.uniqueSessions || 0;
  const isSigned = !!signature;

  // Calculate event counts
  const eventCounts = analytics?.events.reduce((acc, event) => {
    acc[event.eventType] = event.count;
    return acc;
  }, {} as Record<string, number>) || {};

  const sectionsViewed = eventCounts.section_viewed || 0;
  const pricingChanges = eventCounts.pricing_changed || 0;
  const addOnToggles = eventCounts.addon_toggled || 0;
  const signatureStarted = eventCounts.signature_started || 0;
  const formFilled = eventCounts.form_filled || 0;

  // Calculate engagement score
  const calculateEngagementScore = () => {
    if (totalViews === 0) return 0;
    
    const viewScore = Math.min(uniqueSessions / 5, 1) * 20; // Max 20 points for 5+ unique sessions
    const sectionScore = Math.min(sectionsViewed / 6, 1) * 30; // Max 30 points for viewing all sections
    const interactionScore = Math.min((pricingChanges + addOnToggles) / 10, 1) * 30; // Max 30 points
    const conversionScore = (signatureStarted > 0 ? 10 : 0) + (isSigned ? 10 : 0); // Max 20 points
    
    return Math.round(viewScore + sectionScore + interactionScore + conversionScore);
  };

  const engagementScore = calculateEngagementScore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 cursor-pointer">
              <FileText className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">Tempo</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/proposal/${proposalId}`}>
              <Button variant="outline">View Proposal</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{proposal.title}</h1>
              <p className="text-muted-foreground">
                Analytics for {proposal.clientName} • Created {format(new Date(proposal.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            <Badge variant={isSigned ? "default" : "secondary"} className="text-lg px-4 py-2">
              {isSigned ? "Signed" : proposal.status}
            </Badge>
          </div>
        </div>

        {/* Email Delivery Stats */}
        {emailStats && emailStats.totalSent > 0 && (
          <Card className="mb-8 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Delivery & Tracking
              </CardTitle>
              <CardDescription>
                Track how clients engage with emailed proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Mail className="w-4 h-4" />
                    Emails Sent
                  </div>
                  <div className="text-3xl font-bold">{emailStats.totalSent}</div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MailOpen className="w-4 h-4" />
                    Open Rate
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{emailStats.openRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {emailStats.totalOpened} opened
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Eye className="w-4 h-4" />
                    View Rate
                  </div>
                  <div className="text-3xl font-bold text-green-600">{emailStats.viewRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {emailStats.totalViewed} viewed
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Timer className="w-4 h-4" />
                    Avg. Time Spent
                  </div>
                  <div className="text-3xl font-bold">
                    {Math.floor(emailStats.avgTimeSpent / 60)}m {emailStats.avgTimeSpent % 60}s
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per view
                  </p>
                </div>
              </div>
              
              {/* Email Activity Timeline */}
              {emailActivity && emailActivity.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-4">Recent Activity</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {emailActivity.slice(0, 10).map((activity: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">
                              {activity.eventType.replace('_', ' ')}
                            </span>
                            {activity.delivery && (
                              <span className="text-muted-foreground">
                                • {activity.delivery.recipientEmail}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Total Views
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{totalViews}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {uniqueSessions} unique session{uniqueSessions !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <MousePointerClick className="w-4 h-4" />
                Interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {pricingChanges + addOnToggles}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Pricing & add-on changes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Engagement Score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{engagementScore}%</div>
              <p className="text-sm text-muted-foreground mt-1">
                {engagementScore >= 70 ? "High" : engagementScore >= 40 ? "Medium" : "Low"} engagement
              </p>
            </CardContent>
          </Card>

          <Card className={isSigned ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""}>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {isSigned ? "✓" : "○"}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {isSigned ? "Signed" : "Awaiting signature"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Engagement Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>Detailed interaction metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sections Viewed</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min((sectionsViewed / 6) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="font-semibold">{sectionsViewed}/6</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pricing Changes</span>
                <span className="font-semibold">{pricingChanges}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Add-on Toggles</span>
                <span className="font-semibold">{addOnToggles}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Form Fields Filled</span>
                <span className="font-semibold">{formFilled}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Signature Attempts</span>
                <span className="font-semibold">{signatureStarted}</span>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Path to signature</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Viewed Proposal</span>
                  <Badge variant="secondary">{totalViews > 0 ? "100%" : "0%"}</Badge>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: totalViews > 0 ? "100%" : "0%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Viewed Pricing</span>
                  <Badge variant="secondary">
                    {totalViews > 0 ? Math.round((sectionsViewed / 6) * 100) : 0}%
                  </Badge>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: totalViews > 0 ? `${(sectionsViewed / 6) * 100}%` : "0%" }} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Interacted with Pricing</span>
                  <Badge variant="secondary">
                    {totalViews > 0 && (pricingChanges + addOnToggles) > 0 ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: (pricingChanges + addOnToggles) > 0 ? "100%" : "0%" }} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Started Signature</span>
                  <Badge variant="secondary">
                    {signatureStarted > 0 ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: signatureStarted > 0 ? "100%" : "0%" }} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Signed Proposal</span>
                  <Badge variant={isSigned ? "default" : "secondary"}>
                    {isSigned ? "Complete" : "Pending"}
                  </Badge>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: isSigned ? "100%" : "0%" }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Signature Details */}
        {isSigned && signature && (
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Signature Details
              </CardTitle>
              <CardDescription>Proposal accepted and signed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Signed By</p>
                    <p className="font-semibold">{signature.signerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{signature.signerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Signed On</p>
                    <p className="font-semibold">
                      {format(new Date(signature.signedAt), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Tier</p>
                    <p className="font-semibold">{signature.selectedTier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Add-ons</p>
                    <p className="font-semibold">
                      {signature.selectedAddOns.length > 0 
                        ? signature.selectedAddOns.join(", ") 
                        : "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold text-primary">
                      ${(signature.totalPrice / 100).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insights */}
        {!isSigned && (
          <Card>
            <CardHeader>
              <CardTitle>Insights & Recommendations</CardTitle>
              <CardDescription>Tips to improve conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {totalViews === 0 && (
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">No views yet</p>
                      <p className="text-sm text-muted-foreground">
                        Share the proposal link with your client to start tracking engagement.
                      </p>
                    </div>
                  </li>
                )}
                
                {totalViews > 0 && sectionsViewed < 4 && (
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">Low section engagement</p>
                      <p className="text-sm text-muted-foreground">
                        Client hasn't viewed all sections. Consider following up to answer questions.
                      </p>
                    </div>
                  </li>
                )}

                {(pricingChanges + addOnToggles) === 0 && totalViews > 0 && (
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">No pricing interaction</p>
                      <p className="text-sm text-muted-foreground">
                        Client viewed but didn't interact with pricing. They may need clarification.
                      </p>
                    </div>
                  </li>
                )}

                {signatureStarted > 0 && !isSigned && (
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">Signature started but not completed</p>
                      <p className="text-sm text-muted-foreground">
                        Client showed intent but didn't finish. Follow up to address any concerns.
                      </p>
                    </div>
                  </li>
                )}

                {engagementScore >= 70 && !isSigned && (
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <div>
                      <p className="font-medium">High engagement detected</p>
                      <p className="text-sm text-muted-foreground">
                        Client is very interested! This is a great time to follow up.
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

