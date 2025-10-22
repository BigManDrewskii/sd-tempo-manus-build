import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { ArrowRight, FileText, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-3 py-1 border border-gray-300 text-xs font-medium text-gray-600 mb-4">
            Interactive Proposal Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight tracking-tight">
            Transform Static PDFs into
            <span className="block mt-2">Interactive Experiences</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create engaging web proposals with real-time pricing calculators, digital signatures, 
            scroll tracking, and powerful analytics. Close deals faster with proposals that convert.
          </p>

          <div className="flex items-center justify-center gap-4 pt-6">
            {isAuthenticated ? (
            <div className="flex gap-4">
              <Link href="/create-ai">
                <Button size="lg" className="text-base px-8 py-6 bg-black text-white hover:bg-gray-800">
                  Generate with AI
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/create">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 border-gray-300 hover:bg-gray-50">
                  Create Manually
                </Button>
              </Link>
            </div>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="text-base px-8 py-6 bg-black text-white hover:bg-gray-800">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-black">
            Everything You Need to Win More Business
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-gray-200">
              <Zap className="w-6 h-6 text-black mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-black">Real-Time Pricing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Interactive calculators let clients customize packages and see pricing instantly.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200">
              <FileText className="w-6 h-6 text-black mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-black">Digital Signatures</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Built-in signature pads make it easy for clients to accept and sign proposals.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200">
              <TrendingUp className="w-6 h-6 text-black mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-black">Engagement Analytics</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Track time spent, sections viewed, and engagement scores in real-time.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200">
              <Users className="w-6 h-6 text-black mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-black">Scroll Progress</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Visual progress bars show clients how much of the proposal they've reviewed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          <p>© 2025 Tempo. Built for businesses that want to close more deals.</p>
        </div>
      </footer>
    </div>
  );
}

