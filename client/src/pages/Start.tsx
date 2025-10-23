import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Sparkles, FileText, Zap, BarChart3, ArrowRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Start() {
  const { user } = useAuth();
  
  // Fetch recent proposals
  const { data: proposals } = useQuery({
    queryKey: ["/api/proposals"],
  });

  const recentProposals = proposals?.slice(0, 3) || [];

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Personalized Greeting */}
        <div className="mb-8 md:mb-10 lg:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-2 md:mb-3">
            {getGreeting()}, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600">
            What will you build today?
          </p>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12 lg:mb-16">
          <Link href="/create-ai">
            <Card className="border-2 border-black bg-black text-white hover:bg-gray-900 transition-colors cursor-pointer group h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
                <CardTitle className="text-white text-2xl mb-2">Generate with AI</CardTitle>
                <CardDescription className="text-gray-300">
                  Describe your project and let AI create a complete proposal in seconds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-white group-hover:translate-x-1 transition-transform">
                  <span className="font-medium">Start generating</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/templates">
            <Card className="border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors cursor-pointer group h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-black" />
                </div>
                <CardTitle className="text-black text-2xl mb-2">Use a Template</CardTitle>
                <CardDescription className="text-gray-600">
                  Start with a professional template and customize it to your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-black group-hover:translate-x-1 transition-transform">
                  <span className="font-medium">Browse templates</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/create">
            <Card className="border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors cursor-pointer group h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <CardTitle className="text-black text-2xl mb-2">Start from Scratch</CardTitle>
                <CardDescription className="text-gray-600">
                  Build a custom proposal with full control over every detail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-black group-hover:translate-x-1 transition-transform">
                  <span className="font-medium">Create manually</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Secondary Actions & Recent Work */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-4 px-6 border-gray-200 hover:border-gray-300"
                >
                  <BarChart3 className="w-5 h-5 mr-3 text-black" />
                  <div className="text-left">
                    <div className="font-semibold text-black">View Dashboard</div>
                    <div className="text-sm text-gray-600">See all proposals and analytics</div>
                  </div>
                </Button>
              </Link>

              <Link href="/settings/branding">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-4 px-6 border-gray-200 hover:border-gray-300"
                >
                  <Sparkles className="w-5 h-5 mr-3 text-black" />
                  <div className="text-left">
                    <div className="font-semibold text-black">Brand Settings</div>
                    <div className="text-sm text-gray-600">Customize your proposal branding</div>
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Proposals */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Recent Work</h2>
              {recentProposals.length > 0 && (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-black">
                    View all
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>

            {recentProposals.length === 0 ? (
              <Card className="border-gray-200">
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No proposals yet</p>
                  <p className="text-sm text-gray-500">
                    Create your first proposal to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentProposals.map((proposal: any) => (
                  <Link key={proposal.id} href={`/proposal/${proposal.id}/edit`}>
                    <Card className="border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                      <CardContent className="py-4 px-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-black truncate mb-1">
                              {proposal.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(proposal.updatedAt).toLocaleDateString()}
                              </span>
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                {proposal.status}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Getting Started Tip */}
        <Card className="mt-12 border-gray-200 bg-gray-50">
          <CardContent className="py-8 px-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-2">
                  Pro Tip: Start with AI
                </h3>
                <p className="text-gray-700 mb-4">
                  Save hours of work by describing your project to our AI. It will generate a complete, 
                  professional proposal that you can customize and send in minutes.
                </p>
                <Link href="/create-ai">
                  <Button className="bg-black hover:bg-gray-800">
                    Try AI Generator
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

