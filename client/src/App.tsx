import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "./components/Navbar";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateProposal = lazy(() => import("./pages/CreateProposal"));
const CreateProposalAI = lazy(() => import("./pages/CreateProposalAI"));
const ViewProposal = lazy(() => import("./pages/ViewProposal"));
const ProposalAnalytics = lazy(() => import("./pages/ProposalAnalytics"));
const Templates = lazy(() => import("./pages/Templates"));
const CustomizeTemplate = lazy(() => import("./pages/CustomizeTemplate"));
const EditProposal = lazy(() => import("./pages/EditProposal"));
const BrandingSettings = lazy(() => import("./pages/BrandingSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path="/create" component={CreateProposal} />
      <Route path="/create-ai" component={CreateProposalAI} />
      <Route path="/templates" component={Templates} />
      <Route path="/templates/:id/customize" component={CustomizeTemplate} />
       <Route path={"/proposal/:id/edit"} component={EditProposal} />
      <Route path={"/edit/:id"} component={EditProposal} />
      <Route path={"/proposal/:id"} component={ViewProposal} />
      <Route path={"/proposal/:id/analytics"} component={ProposalAnalytics} />      <Route path={"/analytics/:id"} component={ProposalAnalytics} />
      <Route path={"/settings/branding"} component={BrandingSettings} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Navbar />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

