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
    <div className="min-h-screen bg-white">
      {/* Floating Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <FileText className="w-6 h-6" />
                <span className="text-xl font-semibold">Tempo</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/create-ai">
                    <Button size="sm" className="bg-black hover:bg-gray-800">
                      Create Proposal
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </a>
                  <a href={getLoginUrl()}>
                    <Button size="sm" className="bg-black hover:bg-gray-800">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium border border-gray-200 rounded-full">
            Interactive Proposal Platform
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Close More Deals with
            <br />
            Interactive Proposals
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Transform static PDFs into engaging web experiences. Real-time pricing, digital signatures, 
            and analytics that help you win more business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/create-ai">
                  <Button size="lg" className="bg-black hover:bg-gray-800 text-base px-8 h-12">
                    Generate with AI
                    <ArrowRight className="w-5 h-5 ml-2" />
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
                  <Button size="lg" className="bg-black hover:bg-gray-800 text-base px-8 h-12">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
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
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold mb-1">2.5x</div>
              <div className="text-sm text-gray-600">Higher Close Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">60%</div>
              <div className="text-sm text-gray-600">Faster Decisions</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm text-gray-600">Trackable</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Win
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional proposal tools that help you close deals faster and track every interaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Pricing</h3>
              <p className="text-gray-600">
                Interactive calculators let clients customize packages and see pricing instantly. 
                No more back-and-forth emails.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Digital Signatures</h3>
              <p className="text-gray-600">
                Built-in signature pads make it easy for clients to accept and sign proposals 
                without printing or scanning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Engagement Analytics</h3>
              <p className="text-gray-600">
                Track time spent, sections viewed, and engagement scores. 
                Know exactly when to follow up.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Email Tracking</h3>
              <p className="text-gray-600">
                Send proposals directly from Tempo. Get notified when clients open and view your proposals.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Template Library</h3>
              <p className="text-gray-600">
                Start with industry-specific templates. SaaS, Agency, Consulting, and more. 
                Fully customizable.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Professional</h3>
              <p className="text-gray-600">
                Enterprise-grade security. Custom branding. Mobile-optimized. 
                Your proposals, your brand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From Idea to Signed Deal in Minutes
            </h2>
            <p className="text-lg text-gray-600">
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
                <p className="text-gray-600">
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
                <p className="text-gray-600">
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
                <p className="text-gray-600">
                  Clients customize pricing, sign digitally, and you get instant confirmation. 
                  No printing, no scanning, no delays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Start free. Upgrade when you're ready to close more deals.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 border border-gray-200 text-left">
              <div className="text-sm font-medium text-gray-600 mb-2">Starter</div>
              <div className="text-4xl font-bold mb-6">Free</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">5 proposals per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">All core features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Basic analytics</span>
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
              <div className="absolute top-4 right-4 text-xs bg-white text-black px-2 py-1 rounded">
                Popular
              </div>
              <div className="text-sm font-medium text-gray-300 mb-2">Professional</div>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-400">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Unlimited proposals</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Custom branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Priority support</span>
                </li>
              </ul>
              {isAuthenticated ? (
                <Link href="/create-ai">
                  <Button className="w-full bg-white text-black hover:bg-gray-100">
                    Create Proposal
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button className="w-full bg-white text-black hover:bg-gray-100">
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
          <p className="text-lg text-gray-600 mb-8">
            Join businesses that are winning with interactive proposals. 
            Start free, no credit card required.
          </p>
          {isAuthenticated ? (
            <Link href="/create-ai">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-base px-8 h-12">
                Create Your First Proposal
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-black hover:bg-gray-800 text-base px-8 h-12">
                Create Your First Proposal
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5" />
                <span className="font-semibold">Tempo</span>
              </div>
              <p className="text-sm text-gray-600">
                Interactive proposals that close deals faster.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                <li><Link href="/templates" className="hover:text-gray-900">Templates</Link></li>
                <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
                {isAuthenticated && (
                  <li><Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link></li>
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#how-it-works" className="hover:text-gray-900">How It Works</a></li>
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">Support</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div>© 2025 Tempo. Built for businesses that want to close more deals.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-900">Twitter</a>
              <a href="#" className="hover:text-gray-900">LinkedIn</a>
              <a href="#" className="hover:text-gray-900">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

