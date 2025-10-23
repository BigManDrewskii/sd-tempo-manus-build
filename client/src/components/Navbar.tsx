import { useAuth } from "@/_core/hooks/useAuth";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { FileText, LogOut, Menu, Plus, Sparkles, User, X, Palette, Edit } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine current page context
  const isHome = location === "/";
  const isDashboard = location === "/dashboard";
  const isCreating = location.includes("/create") || location.includes("/edit");
  const isViewing = location.match(/^\/proposal\/\d+$/);
  const isTemplates = location.includes("/templates");

  // Don't show navbar on public proposal view (client-facing) or home page (has custom navbar)
  if (isHome || (isViewing && !location.includes("/edit") && !location.includes("/analytics"))) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? "/start" : "/"}>
            <div className="flex items-center hover:opacity-70 transition-opacity cursor-pointer">
              <img src="/logos/proposr-fulllogo.svg" alt="PROPOSR" className="h-7 w-auto" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {/* Dashboard Link */}
                {!isDashboard && !isCreating && (
                  <Link href="/dashboard">
                    <span className="text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer">
                      Dashboard
                    </span>
                  </Link>
                )}

                {/* Templates Link */}
                {!isTemplates && !isCreating && (
                  <Link href="/templates">
                    <span className="text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer">
                      Templates
                    </span>
                  </Link>
                )}

                {/* Create Proposal Dropdown */}
                {!isCreating && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" size="sm" className="gap-2 bg-black text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4" />
                        Create Proposal
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 border-gray-200">
                      <DropdownMenuItem asChild>
                        <Link href="/create-ai">
                          <div className="flex items-center gap-2 w-full cursor-pointer">
                            <Sparkles className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Generate with AI</div>
                              <div className="text-xs text-gray-600">
                                AI-powered proposal
                              </div>
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/templates">
                          <div className="flex items-center gap-2 w-full cursor-pointer">
                            <FileText className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Use Template</div>
                              <div className="text-xs text-gray-600">
                                Start from industry template
                              </div>
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/create">
                          <div className="flex items-center gap-2 w-full cursor-pointer">
                            <Edit className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Create from Scratch</div>
                              <div className="text-xs text-gray-600">
                                Build manually with full control
                              </div>
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-100">
                      <User className="w-4 h-4" />
                      <span className="hidden lg:inline">{user?.name || "Account"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 border-gray-200">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-xs text-gray-600 truncate">
                        {user?.email}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <span className="cursor-pointer w-full">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings/branding">
                        <span className="cursor-pointer w-full flex items-center">
                          <Palette className="w-4 h-4 mr-2" />
                          Brand Settings
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild variant="default" size="sm" className="bg-black text-white hover:bg-gray-800">
                <a href={getLoginUrl()}>Login</a>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <div
                    className="block px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </div>
                </Link>
                <Link href="/templates">
                  <div
                    className="block px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Templates
                  </div>
                </Link>
                <div className="px-4 py-2 space-y-2">
                  <div className="text-xs font-semibold text-gray-600 uppercase">
                    Create Proposal
                  </div>
                  <Link href="/create-ai">
                    <div
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate with AI
                    </div>
                  </Link>
                  <Link href="/templates">
                    <div
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FileText className="w-4 h-4" />
                      Use Template
                    </div>
                  </Link>
                  <Link href="/create">
                    <div
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Edit className="w-4 h-4" />
                      Create from Scratch
                    </div>
                  </Link>
                </div>
                <Link href="/settings/branding">
                  <div
                    className="block px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Palette className="w-4 h-4" />
                    Brand Settings
                  </div>
                </Link>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="px-4 py-2 text-sm">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-xs text-gray-600">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4">
                <Button asChild variant="default" size="sm" className="w-full bg-black text-white hover:bg-gray-800">
                  <a href={getLoginUrl()}>Login</a>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

