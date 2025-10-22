import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateProposal from "./pages/CreateProposal";
import CreateProposalAI from "./pages/CreateProposalAI";
import ViewProposal from "./pages/ViewProposal";
import ProposalAnalytics from "./pages/ProposalAnalytics";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path="/create" component={CreateProposal} />
      <Route path="/create-ai" component={CreateProposalAI} />
      <Route path={"/proposal/:id"} component={ViewProposal} />
      <Route path={"/analytics/:id"} component={ProposalAnalytics} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

