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
const Start = lazy(() => import("./pages/Start"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateProposal = lazy(() => import("./pages/CreateProposal"));
const CreateProposalAI = lazy(() => import("./pages/CreateProposalAI"));
const ViewProposal = lazy(() => import("./pages/ViewProposal"));
const ProposalAnalytics = lazy(() => import("./pages/ProposalAnalytics"));
const Templates = lazy(() => import("./pages/Templates"));
const CustomizeTemplate = lazy(() => import("./pages/CustomizeTemplate"));
const EditProposal = lazy(() => import("./pages/EditProposal"));
const BrandingSettings = lazy(() => import("./pages/BrandingSettings"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Support = lazy(() => import("./pages/Support"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SentryTest = lazy(() => import("./pages/SentryTest"));

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
      <Route path={"/start"} component={Start} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path="/create" component={CreateProposal} />
      <Route path="/create-ai" component={CreateProposalAI} />
      <Route path="/templates" component={Templates} />
      <Route path="/templates/:id/customize" component={CustomizeTemplate} />
       <Route path={"/proposal/:id/edit"} component={EditProposal} />
      {/* Redirect old route to new semantic route */}
      <Route path={"/edit/:id"}>
        {(params) => {
          window.location.href = `/proposal/${params.id}/edit`;
          return null;
        }}
      </Route>
      <Route path={"/proposal/:id"} component={ViewProposal} />
      <Route path={"/proposal/:id/analytics"} component={ProposalAnalytics} />
      {/* Redirect old route to new semantic route */}
      <Route path={"/analytics/:id"}>
        {(params) => {
          window.location.href = `/proposal/${params.id}/analytics`;
          return null;
        }}
      </Route>
      <Route path={"/settings/branding"} component={BrandingSettings} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path="/support" component={Support} />
      <Route path="/sentry-test" component={SentryTest} />
      <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={false}>
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

