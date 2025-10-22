import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import BrandingSettings from "@/pages/BrandingSettings";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateProposal from "./pages/CreateProposal";
import CreateProposalAI from "./pages/CreateProposalAI";
import ViewProposal from "./pages/ViewProposal";
import ProposalAnalytics from "./pages/ProposalAnalytics";
import Templates from "./pages/Templates";
import CustomizeTemplate from "./pages/CustomizeTemplate";
import EditProposal from "./pages/EditProposal";

function Router() {
  return (
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

