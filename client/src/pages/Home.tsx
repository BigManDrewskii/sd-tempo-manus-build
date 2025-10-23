import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ArrowRight, Check, Zap, FileText, BarChart3, Users, Mail, Shield, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

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
                  <Link href="/dashboard">
                    <div>
                      <Button variant="ghost" size="sm">
                        Dashboard
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

          {/* Features Grid - Consistent Card Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Feature Card - Real-Time Pricing */}
            <div className="bg-background border border-border p-6 md:p-8 hover:border-gray-300 transition-all duration-200 flex flex-col">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-Time Pricing Calculator</h3>
              <p className="text-muted-foreground flex-grow">
                Interactive calculators let clients customize packages and see pricing instantly. Close deals faster with transparent, dynamic pricing.
              </p>
            </div>

            {/* Feature Card - Digital Signatures */}
            <div className="bg-background border border-border p-6 md:p-8 hover:border-gray-300 transition-all duration-200 flex flex-col">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Digital Signatures</h3>
              <p className="text-muted-foreground flex-grow">
                Built-in signature pads make it easy for clients to accept and sign proposals without printing or scanning.
              </p>
            </div>

            {/* Feature Card - Analytics */}
            <div className="bg-background border border-border p-6 md:p-8 hover:border-gray-300 transition-all duration-200 flex flex-col">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Engagement Analytics</h3>
              <p className="text-muted-foreground flex-grow">
                Track time spent, sections viewed, and engagement scores. Know exactly when to follow up.
              </p>
            </div>

            {/* Feature Card - Email Tracking */}
            <div className="bg-background border border-border p-6 md:p-8 hover:border-gray-300 transition-all duration-200 flex flex-col">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Email Tracking</h3>
              <p className="text-muted-foreground flex-grow">
                Get notified when clients open your proposals and track engagement.
              </p>
            </div>

            {/* Feature Card - Templates */}
            <div className="bg-background border border-border p-6 md:p-8 hover:border-gray-300 transition-all duration-200 flex flex-col">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Template Library</h3>
              <p className="text-muted-foreground flex-grow">
                Industry-specific templates ready to customize and send.
              </p>
            </div>

            {/* Feature Card - Security */}
            <div className="bg-background border border-border p-6 md:p-8 hover:border-gray-300 transition-all duration-200 flex flex-col">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure & Professional</h3>
              <p className="text-muted-foreground flex-grow">
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
            <div className="bg-background p-8 border border-border text-left flex flex-col">
              <div className="text-sm font-medium text-muted-foreground mb-2">Starter</div>
              <div className="text-4xl font-bold mb-6">Free</div>
              <ul className="space-y-4 mb-8 flex-grow">
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
              <div className="mt-auto">
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
            </div>

            {/* Pro Plan */}
            <div className="bg-black text-white p-8 border border-black text-left relative flex flex-col">
              <div className="absolute top-4 right-4 text-xs bg-background text-black px-2 py-1 rounded">
                Popular
              </div>
              <div className="text-sm font-medium text-gray-300 mb-2">Professional</div>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-400">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-grow">
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
              <div className="mt-auto">
                {isAuthenticated ? (
                  <Link href="/create-ai">
                    <Button className="w-full bg-background text-black hover:bg-accent">
                      Unlock Full Power
                    </Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button className="w-full bg-background text-black hover:bg-accent">
                      Unlock Full Power
                    </Button>
                  </a>
                )}
              </div>
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
      <footer className="border-t border-border py-8 md:py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Brand */}
          <div className="text-center md:text-left mb-8">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img src="/logos/proposr-fulllogo.svg" alt="PROPOSR" className="h-6 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Interactive proposals that close deals faster.
            </p>
          </div>

          {/* Mobile: Dropdown Menus */}
          <div className="md:hidden space-y-2 mb-8">
            {/* Product Dropdown */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleSection('product')}
                className="w-full flex items-center justify-between py-4 text-sm font-semibold hover:text-muted-foreground transition-colors"
              >
                Product
                <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'product' ? 'rotate-180' : ''}`} />
              </button>
              {openSection === 'product' && (
                <ul className="space-y-2 pb-4 text-sm text-muted-foreground">
                  <li><a href="#features" className="hover:text-foreground block py-2">Features</a></li>
                  <li><Link href="/templates" className="hover:text-foreground block py-2">Templates</Link></li>
                  <li><a href="#pricing" className="hover:text-foreground block py-2">Pricing</a></li>
                  {isAuthenticated && (
                    <li><Link href="/dashboard" className="hover:text-foreground block py-2">Dashboard</Link></li>
                  )}
                </ul>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleSection('resources')}
                className="w-full flex items-center justify-between py-4 text-sm font-semibold hover:text-muted-foreground transition-colors"
              >
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              {openSection === 'resources' && (
                <ul className="space-y-2 pb-4 text-sm text-muted-foreground">
                  <li><a href="#how-it-works" className="hover:text-foreground block py-2">How It Works</a></li>
                  <li><Link href="/#how-it-works" className="hover:text-foreground block py-2">Documentation</Link></li>
                  <li><Link href="/support" className="hover:text-foreground block py-2">Support</Link></li>
                </ul>
              )}
            </div>

            {/* Company Dropdown */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleSection('company')}
                className="w-full flex items-center justify-between py-4 text-sm font-semibold hover:text-muted-foreground transition-colors"
              >
                Company
                <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'company' ? 'rotate-180' : ''}`} />
              </button>
              {openSection === 'company' && (
                <ul className="space-y-2 pb-4 text-sm text-muted-foreground">
                  <li><Link href="/#" className="hover:text-foreground block py-2">About</Link></li>
                  <li><Link href="/privacy" className="hover:text-foreground block py-2">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-foreground block py-2">Terms</Link></li>
                </ul>
              )}
            </div>
          </div>

          {/* Desktop: 4 columns */}
          <div className="hidden md:grid md:grid-cols-4 gap-8 mb-8">
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

            {/* Empty column for spacing */}
            <div></div>
          </div>

          <div className="pt-6 md:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="text-center md:text-left">© 2025 PROPOSR. Built for businesses that want to close more deals.</div>
            <div className="flex gap-4 md:gap-6">
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

