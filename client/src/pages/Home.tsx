import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { ArrowRight, FileText, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-secondary/20 rounded-full text-sm font-medium text-primary mb-4">
            Interactive Proposal Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Transform Static PDFs into
            <span className="text-primary block mt-2">Interactive Experiences</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create engaging web proposals with real-time pricing calculators, digital signatures, 
            scroll tracking, and powerful analytics. Close deals faster with proposals that convert.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
            <div className="flex gap-4">
              <Link href="/create-ai">
                <Button size="lg" className="text-lg px-8 py-6">
                  Generate with AI
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/create">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Create Manually
                </Button>
              </Link>
            </div>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="text-lg px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-card/50 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Everything You Need to Win More Business
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-lg bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Real-Time Pricing</h3>
              <p className="text-muted-foreground">
                Interactive calculators let clients customize packages and see pricing instantly.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Digital Signatures</h3>
              <p className="text-muted-foreground">
                Built-in signature pads make it easy for clients to accept and sign proposals.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Engagement Analytics</h3>
              <p className="text-muted-foreground">
                Track time spent, sections viewed, and engagement scores in real-time.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Scroll Progress</h3>
              <p className="text-muted-foreground">
                Visual progress bars show clients how much of the proposal they've reviewed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Tempo. Built for businesses that want to close more deals.</p>
        </div>
      </footer>
    </div>
  );
}

