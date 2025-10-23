import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ArrowRight, Check, Zap, FileText, BarChart3, Users, Mail, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-sm border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img src="/logos/proposr-fulllogo.svg" alt="PROPOSR" className="h-7 w-auto" />
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/start">
                    <div>
                      <Button variant="ghost" size="sm">
                        Start
                      </Button>
                    </div>
                  </Link>
                  <Link href="/create-ai">
                    <div>
                      <Button size="sm" variant="default">
                        Create Proposal
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => window.location.href = getLoginUrl()}>
                    Sign In
                  </Button>
                  <Button size="sm" variant="default" onClick={() => window.location.href = getLoginUrl()}>
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block px-4 py-1 mb-6 text-xs font-medium border border-border rounded-full">
            Interactive Proposal Platform
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Close More Deals with
            <br />
            Interactive Proposals
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto">
            Transform static PDFs into engaging web experiences. Real-time pricing, digital signatures, 
            and analytics that help you win more business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/create-ai">
                 <Button size="lg" variant="default" className="text-base px-8 h-12">
                    Generate with AI
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="text-base px-8 h-12">
                    Browse Templates
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button size="lg" variant="default" className="text-base px-8 h-12">
                    Get Started Free
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </a>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="text-base px-8 h-12">
                    View Templates
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border">
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">2.5x</div>
              <div className="text-sm text-muted-foreground">Higher Close Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">60%</div>
              <div className="text-sm text-muted-foreground">Faster Decisions</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">100%</div>
              <div className="text-sm text-muted-foreground">Trackable</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Everything You Need to Win
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional proposal tools that help you close deals faster and track every interaction.
            </p>
          </div>

          {/* Bento Box Grid - Asymmetric Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 lg:gap-6 auto-rows-fr">
            {/* Hero Feature - Real-Time Pricing (Large, spans 7 columns, 2 rows) */}
            <div className="md:col-span-7 md:row-span-2 bg-black text-white p-8 md:p-10 lg:p-12 flex flex-col justify-between min-h-[400px] md:min-h-[480px]">
              <div>
                <div className="w-16 h-16 bg-background text-black flex items-center justify-center mb-10">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 leading-tight">Real-Time Pricing Calculator</h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-lg">
                  Interactive calculators let clients customize packages and see pricing instantly. 
                  No more back-and-forth emails. Close deals faster with transparent, dynamic pricing that adapts to their needs.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-10">
                <div className="h-1 w-12 bg-background"></div>
                <span className="text-sm text-gray-400">Most popular feature</span>
              </div>
            </div>

            {/* Secondary Feature - Digital Signatures (Medium, 5 columns, 1 row) */}
            <div className="md:col-span-5 bg-background p-6 md:p-8 border border-border min-h-[200px] md:min-h-[230px] flex flex-col">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Digital Signatures</h3>
              <p className="text-muted-foreground flex-grow">
                Built-in signature pads make it easy for clients to accept and sign proposals without printing or scanning.
              </p>
            </div>

            {/* Secondary Feature - Analytics (Medium, 5 columns, 1 row) */}
            <div className="md:col-span-5 bg-background p-6 md:p-8 border border-border min-h-[200px] md:min-h-[230px] flex flex-col">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Engagement Analytics</h3>
              <p className="text-muted-foreground flex-grow">
                Track time spent, sections viewed, and engagement scores. Know exactly when to follow up.
              </p>
            </div>

            {/* Tertiary Feature - Email Tracking (Small, 4 columns) */}
            <div className="md:col-span-4 bg-muted p-6 md:p-7 border border-border min-h-[180px] md:min-h-[200px] hover:border-gray-300 transition-colors">
              <Mail className="w-10 h-10 text-black mb-5" />
              <h3 className="text-lg font-semibold mb-2">Email Tracking</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get notified when clients open your proposals and track engagement.
              </p>
            </div>

            {/* Tertiary Feature - Templates (Small, 4 columns) */}
            <div className="md:col-span-4 bg-muted p-6 md:p-7 border border-border min-h-[180px] md:min-h-[200px] hover:border-gray-300 transition-colors">
              <Users className="w-10 h-10 text-black mb-5" />
              <h3 className="text-lg font-semibold mb-2">Template Library</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Industry-specific templates ready to customize and send.
              </p>
            </div>

            {/* Tertiary Feature - Security (Small, 4 columns) */}
            <div className="md:col-span-4 bg-muted p-6 md:p-7 border border-border min-h-[180px] md:min-h-[200px] hover:border-gray-300 transition-colors">
              <Shield className="w-10 h-10 text-black mb-5" />
              <h3 className="text-lg font-semibold mb-2">Secure & Professional</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enterprise-grade security with custom branding options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              From Idea to Signed Deal in Minutes
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple, fast, and effective. No learning curve.
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create with AI or Templates</h3>
                <p className="text-muted-foreground">
                  Generate a complete proposal in seconds using AI, or start with a professional template. 
                  Add your branding, pricing, and content.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Send and Track</h3>
                <p className="text-muted-foreground">
                  Share a link or send via email. Get real-time notifications when clients open, 
                  view, and interact with your proposal.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-black text-white flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Close the Deal</h3>
                <p className="text-muted-foreground">
                  Clients customize pricing, sign digitally, and you get instant confirmation. 
                  No printing, no scanning, no delays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-6 bg-muted">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Start free. Upgrade when you're ready to close more deals.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-background p-8 border border-border text-left">
              <div className="text-sm font-medium text-muted-foreground mb-2">Starter</div>
              <div className="text-4xl font-bold mb-6">Free</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">5 proposals per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">All core features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Basic analytics</span>
                </li>
              </ul>
              {isAuthenticated ? (
                <Link href="/create-ai">
                  <Button variant="outline" className="w-full">
                    Create Proposal
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button variant="outline" className="w-full">
                    Get Started Free
                  </Button>
                </a>
              )}
            </div>

            {/* Pro Plan */}
            <div className="bg-black text-white p-8 border border-black text-left relative">
              <div className="absolute top-4 right-4 text-xs bg-background text-black px-2 py-1 rounded">
                Popular
              </div>
              <div className="text-sm font-medium text-gray-300 mb-2">Professional</div>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-400">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Unlimited proposals</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Custom branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Priority support</span>
                </li>
              </ul>
              {isAuthenticated ? (
                <Link href="/create-ai">
                  <Button className="w-full bg-background text-black hover:bg-accent">
                    Create Proposal
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button className="w-full bg-background text-black hover:bg-accent">
                    Start Free Trial
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Close More Deals?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join businesses that are winning with interactive proposals. 
            Start free, no credit card required.
          </p>
          {isAuthenticated ? (
            <Link href="/create-ai">
              <Button size="lg" variant="default" className="text-base px-8 h-12">
                Create Your First Proposal
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" variant="default" className="text-base px-8 h-12">
                Create Your First Proposal
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-4">
                <img src="/logos/proposr-fulllogo.svg" alt="PROPOSR" className="h-6 w-auto" />
              </div>
              <p className="text-sm text-muted-foreground">
                Interactive proposals that close deals faster.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><Link href="/templates" className="hover:text-foreground">Templates</Link></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                {isAuthenticated && (
                  <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
                <li><Link href="/#how-it-works" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-foreground">Support</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/#" className="hover:text-foreground">About</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2025 PROPOSR. Built for businesses that want to close more deals.</div>
            <div className="flex gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">LinkedIn</a>
              <a href="https://github.com/BigManDrewskii/sd-tempo-manus-build" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

